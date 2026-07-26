# Bilhandlarsystem — Projektplan

> ⏸️ **PAUSAD (2026-07).** Den här planen (eget Blocket-API + Supabase + admin)
> är **inte** det vi bygger just nu. Blocket svarade aldrig på API-token, och
> handlaren använder redan **Nextlease** (som sköter Blocket-publiceringen). Vi
> byggde istället en Next.js-sajt som bäddar in Nextlease-widgeten.
> **Aktuell inriktning: se [STATE.md](STATE.md) och [phases.md](phases.md).**
> Planen nedan behålls om den blir aktuell igen (billig regnr-källa + Blocket-token).

## Syfte

Ett system för en bilhandlare som ersätter Framer + Nextlease. Handlaren laddar upp en bil **en gång** i ett eget admin-gränssnitt. Systemet publicerar automatiskt annonsen på Blocket och visar bilen på handlarens webbsida.

Handlaren behöver aldrig logga in på Blocket eller hantera webbsidan separat.

---

## Tech Stack

- **Next.js (App Router)** — frontend och backend i ett projekt
- **Supabase** — PostgreSQL-databas, autentisering (Auth), fillagring (Storage)
- **Vercel** — hosting
- **Blocket Pro Import API v4** — publicering av bilannonser

---

## Arkitektur

```
Handlaren (admin-panel)
         ↓
    Supabase DB  ←→  Next.js (API routes + sidor)
         ↓                        ↓
    Webbsidan                Blocket API v4
  (läser /api/cars)        (tar emot annonser)
```

**Regel:** Databasen är den enda källan för all data. Blocket och webbsidan är separata destinationer. Blocket API kan inte användas för att läsa data till webbsidan — detta är en explicit begränsning i Blockets dokumentation.

---

## Mappstruktur

```
/app
  /admin                          # skyddade sidor, kräver inloggning
    /page.tsx                     # översikt: lista alla bilar
    /cars/new/page.tsx            # formulär: lägg till bil
    /cars/[id]/page.tsx           # formulär: redigera / ta bort bil
  /bilar
    /page.tsx                     # publik billistning
    /[id]/page.tsx                # publik detaljsida
  /api
    /cars/route.ts                # GET — publik, webbsidan läser härifrån
    /cars/[id]/route.ts           # GET — publik, enskild bil
    /admin/cars/route.ts          # POST — skapa bil (skyddad)
    /admin/cars/[id]/route.ts     # PATCH, DELETE — uppdatera/ta bort (skyddad)
    /admin/cars/[id]/retry/route.ts  # POST — försök om Blocket-synk (skyddad)
    /sync/blocket/route.ts        # intern synk mot Blocket API
/lib
  /supabase.ts                    # Supabase-klient
  /blocket.ts                     # Blocket API-klient och hjälpfunktioner
```

---

## Supabase-setup (görs en gång)

- Skapa Supabase-projekt
- Kör SQL för `cars`-tabellen (se schema nedan)
- Skapa trigger som auto-uppdaterar `updated_at` vid varje rad-uppdatering
- Skapa Storage-bucket `cars` som **publik** (Blocket måste kunna ladda ner bilderna)
- Aktivera Row Level Security (RLS) på `cars`:
  - **Läs-policy** (`anon` role): tillåt SELECT när `status = 'active'` (det publika API:et behöver kunna läsa)
  - **Skriv-policy** (`authenticated` role): tillåt INSERT/UPDATE/DELETE för alla rader
- Skapa admin-användare via Supabase Auth (email + lösenord räcker — det är bara handlaren som har konto)

---

## Databas — Tabell: `cars`

Fältnamnen följer Blockets terminologi för att slippa onödig mappning.

```sql
id                   UUID PRIMARY KEY DEFAULT gen_random_uuid()
registration_number  TEXT NOT NULL UNIQUE        -- regnummer, t.ex. "ABC123" (kritiskt för migration)
brand                TEXT NOT NULL               -- märke, t.ex. "volvo" (slug-format som Blocket)
model                TEXT NOT NULL               -- modell, t.ex. "xc60"
year                 INTEGER NOT NULL            -- årsmodell
price                INTEGER NOT NULL            -- pris i SEK (heltal)
mileage              INTEGER NOT NULL            -- miltal i km
fuel                 TEXT                        -- enum, hämta giltiga värden via Blocket API
gearbox              TEXT                        -- enum, hämta giltiga värden via Blocket API
body_type            TEXT                        -- enum: sedan, kombi, suv, m.fl.
color                TEXT
description          TEXT                        -- OBS: tecknen < och > är ej tillåtna av Blocket
images               TEXT[]                      -- array av publika URL:er från Supabase Storage
status               TEXT DEFAULT 'draft'        -- 'draft' | 'active' | 'sold'
visible              BOOLEAN DEFAULT true        -- false = skapas i Blocket men publiceras ej
blocket_ad_id        TEXT                        -- Blockets annons-ID, sätts asynkront, NULL tills dess
blocket_status       TEXT DEFAULT 'pending'      -- 'pending' | 'published' | 'failed' | 'deleted'
blocket_error        TEXT                        -- felmeddelande från Blocket vid failed sync
created_at           TIMESTAMPTZ DEFAULT NOW()
updated_at           TIMESTAMPTZ DEFAULT NOW()   -- uppdateras automatiskt via trigger
```

**Viktigt om `id`:** Används som `source_id` mot Blocket. Kan aldrig återanvändas — inte ens efter att annonsen raderats — eftersom Blocket gör soft delete och behåller historiken.

**Viktigt om `registration_number`:** Nyckeln för att koppla nya API-annonser till handlarens befintliga annonser i Blocket Admin (se "Initial migration" nedan).

---

## Admin-panel (`/admin`)

Skyddas med Supabase Auth (email + lösenord). Bara handlaren har konto.

### Sidor och beteenden

**`/admin`**
- Lista alla bilar med: regnummer, märke, modell, år, pris, `blocket_status`, `status`
- Varning om `blocket_status = 'failed'` med "Försök igen"-knapp som triggar `POST /api/admin/cars/[id]/retry`
- Felmeddelandet från `blocket_error` visas tillsammans med varningen

**`/admin/cars/new`**
- Formulär med alla bilfält
- Dropdowns för `brand`, `model`, `fuel`, `gearbox`, `body_type` populeras från Blockets enum-lookup-endpoints (se Blocket-integration nedan)
- Bilduppladdning → laddas upp till Supabase Storage, URL:erna sparas i `images`-arrayen
- Innan POST: kör `POST /v4/car/validate` mot Blocket för att fånga valideringsfel tidigt
- Spara → bil skapas i databasen med `status = 'active'` → Blocket-synk triggas

**`/admin/cars/[id]`**
- Samma formulär som new, förifyllt med befintlig data
- Spara → uppdateras i databasen → PATCH skickas till Blocket
- "Markera som såld" → `status = 'sold'` → DELETE skickas till Blocket → döljs på webbsidan
- Radera → tar bort från databasen → DELETE skickas till Blocket

---

## Publika sidor

**`/bilar`**
- Hämtar alla bilar med `status = 'active'` via `GET /api/cars`
- Visar bilkort: bild, märke, modell, år, pris, miltal

**`/bilar/[id]`**
- Hämtar enskild bil via `GET /api/cars/[id]`
- Visar alla fält och bildgalleri

---

## API-routes

| Metod | Path | Auth | Beskrivning |
|---|---|---|---|
| GET | `/api/cars` | Ingen | Returnerar alla bilar med `status = 'active'` |
| GET | `/api/cars/[id]` | Ingen | Returnerar en specifik bil |
| POST | `/api/admin/cars` | Admin | Skapar bil i DB + triggar Blocket-publicering |
| PATCH | `/api/admin/cars/[id]` | Admin | Uppdaterar bil i DB + synkar till Blocket |
| DELETE | `/api/admin/cars/[id]` | Admin | Tar bort bil + avpublicerar på Blocket |
| POST | `/api/admin/cars/[id]/retry` | Admin | Försöker om Blocket-synken vid `blocket_status = 'failed'` |

---

## Blocket-integration

### Autentisering

- Statiskt JWT-token, hämtas genom mail till `butikssupport@blocket.se`
- Skickas som header på varje request: `X-Auth-Token: <token>`
- Lagras i miljövariabeln `BLOCKET_JWT_TOKEN`
- Tokenets scope är `dealer_code` (enskild handlare) — `dealer_code` behöver då inte skickas i request body, det härleds från tokenet

### Endpoints som används

| Metod | Path | När |
|---|---|---|
| POST | `/v4/car/validate` | Validera payload innan POST (admin-formuläret) |
| POST | `/v4/car` | Ny bil skapas i admin |
| PATCH | `/v4/car/{source_id}` | Bil redigeras i admin |
| DELETE | `/v4/ad/{source_id}` | Bil säljs eller raderas |
| GET | `/v4/ad/{source_id}` | Statuskoll efter POST (polling) |
| GET | `/v4/vehicles/car/attributes` | Lista tillgängliga fält för bilar |
| GET | `/v4/vehicles/car/{attribute}` | Hämta giltiga enum-värden (för admin-dropdowns) |
| GET | `/v4/vehicles/car/models?brand={brand}` | Hämta modeller för ett valt märke |

Bas-URL: `https://api.blocket.se/pro-import-api`

### Statuskoll (polling efter POST)

Blocket är asynkront — annonsen är inte live direkt efter POST.

1. Skicka POST
2. Poll `GET /v4/ad/{source_id}` med ~2 sekunders mellanrum
3. Vänta tills `logs` innehåller `{ action: "publish", state: "done" }`
4. Spara det returnerade `blocket_ad_id` i databasen
5. Sätt `blocket_status = 'published'`
6. Om `state: "error"` uppstår → sätt `blocket_status = 'failed'` och spara felmeddelandet i `blocket_error`

### Exempelpayload (POST ny bil)

```json
{
  "source_id": "uuid-från-databasen",
  "category_id": 1020,
  "body": "Välskött bil med full servicehistorik.",
  "visible": true,
  "url": "https://johnssonsbilcenter.se/bilar/uuid-från-databasen",
  "price": [{ "type": "list", "amount": 349900, "currency": "SEK" }],
  "image_urls": [
    "https://<supabase-url>/storage/v1/object/public/cars/bild1.jpg",
    "https://<supabase-url>/storage/v1/object/public/cars/bild2.jpg"
  ],
  "category_fields": {
    "registration_number": "ABC123",
    "brand": "volvo",
    "model": "xc60",
    "year": 2022,
    "mileage": 28000,
    "fuel": "diesel",
    "gearbox": "automatic",
    "body_type": "suv",
    "color": "black"
  }
}
```

### Regler och begränsningar från Blockets dokumentation

- `title` ska **inte** skickas för bilar — genereras automatiskt av Blocket
- `contact` ska **inte** skickas för bilar — hämtas från handlarens Blocket-konto
- `location` kan utelämnas — defaults till handlarens adress från Blocket-kontot
- `category_id` för bilar = `1020`
- `source_id` kan aldrig återanvändas — inte ens efter radering (soft delete)
- Max 30 bilder per annons
- Tecknen `<` och `>` är ej tillåtna i `body` — ersätts med "-" av Blocket
- Giltiga enum-värden hämtas via enum-lookup-endpoints eller från Swagger UI: `https://api.blocket.se/pro-import-api/docs/swagger-ui/`
- Ingen separat testmiljö — testa med `visible: false` (kostar ingenting, publiceras ej)
- Ändringar gjorda direkt i Blocket Admin syns inte i API:et — allt måste hanteras via API

---

## Initial migration av befintliga Blocket-annonser

Handlaren har redan ~25 annonser på Blocket som skapats via Blocket Admin manuellt. Dessa måste kopplas till systemet vid uppstart.

**Process:**
1. Lista handlarens befintliga annonser från Blocket Admin (manuellt)
2. För varje befintlig annons: skapa en rad i `cars`-databasen med samma `registration_number`
3. Skicka `POST /v4/car` med all data — **Blocket matchar på `registration_number`** och kopplar samman annonsen automatiskt
4. Annonsen har nu en `source_id` (samma som DB-radens `id`) och kan hanteras helt via API:et framöver

**Viktigt:** Efter koppling ska ändringar bara göras via API:et. Ändringar i Blocket Admin syns inte tillbaka i systemet.

---

## Bildhantering

- Handlaren laddar upp bilder i admin-formuläret
- Bilderna lagras i Supabase Storage (publik bucket `cars`)
- Publika URL:er sparas i `cars.images` (array)
- URL:erna skickas till Blocket i `image_urls` — Blocket laddar ner bilderna själv
- Bildordning i formuläret = bildordning på Blocket och webbsidan
- Max 30 bilder per bil
- Accepterade format: JPG, PNG

---

## Miljövariabler

```
BLOCKET_JWT_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=                 # används för att bygga 'url'-fältet till Blocket
```

---

## Utanför MVP

Funktioner som finns i Blocket API men inte ingår i första versionen:

- **Bump/renewal** (`GET /v4/ad/{source_id}/bump`) — förnyar gammal annons så den dyker upp först i listan igen (extra kostnad per bump)
- **Pole Position** (`GET /v4/ad/{source_id}/pole_position`) — premiumfunktion, annons först i sökresultat i 3 dagar (extra kostnad)
- **Leasing-pris** — utöver vanligt listpris
- **Andra fordonstyper** — MVP är bara bilar (`category_id: 1020`). Övriga typer: transport, motorcycle, atv, snowmobile, camper, caravan, trailer, boat, truck, bus, construction, agriculture-*
- **Exkludera Bytbil** — Pro Import API publicerar även på Bytbil per default. Exkludering via `exclude_bytbil=true` finns men används inte i MVP