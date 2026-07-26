# Pro Import API

> ⏸️ **Referens för en PAUSAD integration.** Detta är Blockets Pro Import API-
> dokumentation. Vi använder **inte** Blocket-API:et direkt just nu — se
> [STATE.md](STATE.md). Behålls som referens om integrationen återupptas.

# Description

The Pro Import API allows you to manage your Blocket ads programmatically. This document describes how to create, update and delete ads, by invoking a REST API. It also describes how to get information about the state of your ads.

The Pro Import API should only be used for managing ads on Blocket and Bytbil, not for powering websites or similar. API users must keep a record of ads in their own system. Any changes made directly in Blocket Admin will not be reflected when retrieving the ad via the API. The API only exposes data that was created or updated through the API itself. For consistency and data integrity, all ad modifications should preferably be performed via the API.

Are you migrating from legacy file imports? Pay attention to the [chapter on migration](#migration-from-file-imports-via-ftp).

For recent changes and new features, see the [Changelog](changelog).

# Caveats

* By using the API, you cannot publish ads outside registered vehicles manually and pay by invoice.
* Ad body doesn't support certain characters — these will be replaced by "-". Currently the affected characters are: "<", ">".
* Terminology about *dealers* and *dealer\_groups* originates from mobility customers, but applies to other types of customers too.
* Not all category specific fields are yet supported.

# OpenAPI documentation

The API documentation is available at the following URLs:

| Service | URL |
| :---- | :---- |
| Swagger | [https://api.blocket.se/pro-import-api/docs/swagger-ui/](https://api.blocket.se/pro-import-api/docs/swagger-ui/) |
| ReDoc | [https://api.blocket.se/pro-import-api/docs/redoc/](https://api.blocket.se/pro-import-api/docs/redoc/) |

# Testing

There is no separate test environment. All API integrations must be developed and tested directly in the **production environment**.

To avoid publishing test ads on the marketplaces, you can set `visible: false` when creating ads. These ads will:

* Not be published on any marketplaces
* Be accessible only within **Blocket Admin** and the **API**
* **Not incur any charges**, as they are not publicly listed on the marketplaces

There is also a `/v4/{vehicle_type}/validate` endpoint that can be used to validate input data without saving anything.

# The workflow

The API allows you to create, update, renew and delete ads. After making a request it will be processed asynchronously, and you will be able to check the progress and result by looking at the action logs associated with the ad, and the final state of the ad.

The common procedure to create an ad is as follows:

1. Submit an ad by performing an HTTP POST to the API with all the ad data.
2. Perform an HTTP GET to the API to check the status of the ad creation.

If everything went well, the response from the HTTP GET will contain info on all state transitions performed during the workflow execution (`logs` field), as well as a Blocket ad ID (`blocket_ad_id`) for the newly created Blocket ad and Bytbil ad ID (`offer_id`) for registered vehicles.

> **Important:** The `blocket_ad_id` field is assigned asynchronously after the ad has been published on Blocket. It will be `null` immediately after POST — this is expected behavior. Poll via `GET /v4/ad/{source_id}` until the log shows `publish | done` and `blocket_ad_id` is populated. Typical latency is seconds to minutes depending on current load.

All **actions** made on the ad while processing it will have their own state. By inspecting the ad logs you can track each action and its state. All actions start with the state processing and transition into done when completed. If there was an error while processing, the action will end up in state error.

The ad itself will have a **state** indicating if the ad was created or deleted. While this means that the ad was successfully created in the API, there could be more information in the ad logs which could indicate that there was an issue with a specific action.

##### **Ad actions**

| Name | Type | Description |
| :---- | :---- | :---- |
| `create` | string | Action for creating the ad within the API |
| `update` | string | Action for updating the ad |
| `bump` | string | Action for renewing the ad on marketplaces |
| `boost` | string | Action for activating Pole Position on the ad |
| `handle_media` | string | Action for handling media on the ad (uploading images, removing previous images etc) |
| `publish` | string | Action for publishing the ad on marketplaces |
| `delete` | string | Action for removing the ad |
| `unpublish` | string | Action for unpublishing the ad on marketplaces |

##### **Ad log states**

| Name | Type | Description |
| :---- | :---- | :---- |
| `processing` | string | Ad action is being processed |
| `done` | string | Ad action completed successfully |
| `error` | string | There were error(s) while processing the action |

##### **Log entry structure**

Each entry in the `log` array has the following fields:

| Field | Type | Description |
| :---- | :---- | :---- |
| `request_id` | string (UUID) | Groups all actions performed during a single API request |
| `created` | string (ISO 8601) | Timestamp when the log entry was created |
| `action` | string | One of the ad actions listed above (e.g. `create`, `publish`) |
| `state` | string | One of `processing`, `done`, or `error` |
| `external_message` | string / object | Human-readable status message or error details |

Example value (after a successful create + publish flow):

```json
[
  {"request_id": "a1b2c3d4-...", "created": "2025-01-15T10:00:00Z", "action": "create",       "state": "processing", "external_message": "Processing"},
  {"request_id": "a1b2c3d4-...", "created": "2025-01-15T10:00:00Z", "action": "create",       "state": "done",       "external_message": "Ad created"},
  {"request_id": "a1b2c3d4-...", "created": "2025-01-15T10:00:01Z", "action": "handle_media",  "state": "processing", "external_message": "Processing"},
  {"request_id": "a1b2c3d4-...", "created": "2025-01-15T10:00:02Z", "action": "handle_media",  "state": "done",       "external_message": "Images uploaded"},
  {"request_id": "a1b2c3d4-...", "created": "2025-01-15T10:00:03Z", "action": "publish",       "state": "processing", "external_message": "Publishing in progress."},
  {"request_id": "a1b2c3d4-...", "created": "2025-01-15T10:00:05Z", "action": "publish",       "state": "done",       "external_message": "Ad published"}
]
```

> **Tip:** To check if an ad has been fully published, poll `GET /v4/{vehicle_type}/{source_id}` and look for a log entry with `action: publish` and `state: done`. The `request_id` field lets you correlate which actions belong to the same API call. For ads with a long action history, use `GET /v4/ad/{source_id}/log?request_id={request_id}` to retrieve only the log entries for a specific request.

**Ad states**

| Name | Type | Description |
| :---- | :---- | :---- |
| `created` | string | Ad is created. Note: the ad may not be visible on the marketplace if `visible=false` is set or a marketplace error occurred — check log messages for details. |
| `deleted` | string | Ad is deleted (soft delete — the ad is unpublished from all marketplaces but remains retrievable via GET) |

> **Note:** The `state` field is updated asynchronously by the background worker. After a `DELETE` request, the state will remain `created` until the worker has finished processing. Poll via `GET` and check for a log entry with `action: delete` and `state: done` — at that point the ad's state will be `deleted`. See the DELETE endpoint section for details.
>
> Deletion is a soft delete. The ad is unpublished from all marketplaces, but the ad data is retained in the API and can still be retrieved via `GET /v4/ad/{source_id}` or `GET /v4/{vehicle_type}/{source_id}`.

# Authentication

All invocations to the API require a JWT token sent as a `X-Auth-Token` request header. You can get one from customer support by contacting [butikssupport@blocket.se](mailto:butikssupport@blocket.se). The token contains one of two scope types:

* `dealer_code` — Grants access to a single dealer. The `dealer_code` field can be omitted from the request body — it is inferred from the token.
* `dealer_group` — Grants access to all dealers within a group. A dealer group contains one or more dealer codes. When creating an ad (`POST`), you **must** include `dealer_code` in the request body to specify which dealer the ad belongs to. For updates and deletes, the `dealer_code` is read from the existing ad.

# Error Responses

## HTTP Status Codes

| Status | Meaning | When |
| :---- | :---- | :---- |
| `200` | OK | GET, PUT, PATCH, DELETE succeeded |
| `201` | Created | POST succeeded — ad created and queued for processing |
| `400` | Bad Request | Validation error — see error format below |
| `401` | Unauthorized | Missing or invalid `X-Auth-Token` header |
| `403` | Forbidden | Token is valid but lacks required scope for the endpoint |
| `404` | Not Found | Ad with the given `source_id` does not exist or does not belong to your dealer |

## Error Format

When a request fails validation, the API returns HTTP 400 with a JSON object. Each key is a field name, and each value is an array of error messages for that field:

```json
{
  "title": ["This field is required."],
  "contact": ["This field is required."]
}
```

Nested field errors (e.g. `category_fields`) include the full path:

```json
{
  "category_fields": {
    "registration_number": ["This field is required."],
    "brand": ["\"invalid_brand\" is not a valid choice."]
  }
}
```

Non-field errors (e.g. business logic violations) use a string array under a single key:

```json
["Ad has been deleted, cannot update"]
```

Authentication errors (401) return:

```json
{"detail": "Invalid token: <error details>"}
```

# API Versions

* **V4** (`/v4/{vehicle_type}/`) — Current version, recommended for new integrations. Supports all vehicle categories including full field support for Moped, Camper, Caravan, Trailer, Boats and Agriculture.
* **V3** (`/v3/ad`) — Legacy version, still fully supported. New features are V4-only.

API base URL V3: **https://api.blocket.se/pro-import-api/v3/**

API base URL V4: **https://api.blocket.se/pro-import-api/v4/**

# Renewal and promotion

It is possible to **renew** a Blocket ad. This invocation is asynchronous and requires no JSON body. A renewal of an ad will make it appear as new — first in the listing (charges apply).

* `GET /v4/ad/{source_id}/bump`
  initiates a renewal of a Blocket ad

For registered vehicles, you can choose to exclude either Blocket or Bytbil by passing `exclude_bytbil=true` or `exclude_blocket=true`.

It is also possible to activate **Pole Position** on an ad. This will make the ad appear first in the search result. If several ads with Pole Position match the end user's search filter, only one is shown. Pole Position lasts for 3 days. Charges apply.

* `GET /v4/ad/{source_id}/pole_position`
  activates Pole Position on an ad

**Prerequisites:** The ad must be visible (`visible=true`). Pole Position is only available for registered vehicle categories (Blocket only).

# Endpoints

> **Note:** All generic `/v4/ad/` endpoints (GET, DELETE, bump, pole_position, retry) are also available on the typed endpoints (`/v4/{vehicle_type}/`). For POST, PUT and PATCH you **must** use the typed endpoints.

The POST, PUT, PATCH and DELETE API invocations are asynchronous. This means you will get a prompt response, but the operation will be executed afterwards. The only synchronous operation is the GET invocation (except /bump and /pole_position).

### POST /v4/{vehicle_type} — Create an ad {#post-/ad---create-an-ad}

Use this endpoint to create an ad. The creation will happen asynchronously and you will need to check the status/result of the operation with a GET request.

Refer to the [OpenAPI documentation](#openapi-documentation) for more detailed information about all fields.

#### Ad fields

| Name | Type | In | Required | Description |
| :---- | :---- | :---- | :---- | :---- |
| `id` | string (UUID) | Response | — | Internal ad ID |
| `source_id` | string | Both | Yes | Client's reference ID. See `source_id` section. |
| `dealer_code` | string | Both | Depends | The dealer\_code for which to create the ad. Required if auth scope is `dealer_group`, not needed if auth scope is `dealer_code`. |
| `category_id` | int | Both | Yes | See `category_id` section |
| `state` | string | Response | — | Ad state: `created` or `deleted`. Updated asynchronously — see Ad States section. |
| `title` | string | Both | Depends | Ad title. **Required** for: boat, truck, bus, construction, and agriculture categories. **Must not be sent** for: car, transport, motorcycle, moped, snowmobile, ATV, camper, caravan, and trailer — the title is generated automatically, and including it will return a `400` error. |
| `body` | string | Both | No | Ad body text |
| `visible` | boolean | Both | No | `Default=true`. Set to `false` to prevent the ad from being published on marketplaces. |
| `price` | array of objects | Both | No | See `price` section |
| `image_urls` | array of strings | Request | No | See `image_urls` section |
| `image_refs` | array of objects | Response | — | Processed image references. Each object contains `url` (original URL), `cdn_url` (CDN URL where the image is served), `id` (internal image reference ID), and `checksum`. |
| `url` | string | Both | No | URL to page at the seller's website with more info about the ad. |
| `video_url` | string | Both | No | URL to Youtube or Vimeo video that is shown on the ad page. |
| `location` | object | Both | No | See `location` section. |
| `contact` | object | Both | Depends | See `contact` section. **Required** for: boat, truck, bus, construction, and agriculture categories. **Must not be sent** for: car, transport, motorcycle, moped, snowmobile, ATV, camper, caravan, and trailer — including it will return a `400` error. |
| `category_fields` | object | Both | Yes | Vehicle-specific attributes (e.g. `registration_number`, `brand`, `fuel`, `mileage`). These fields are displayed on the ad page on blocket.se and enable filtering in search results. The available fields vary by vehicle type — see the [Category Reference](category-reference) or the [Swagger UI](https://api.blocket.se/pro-import-api/docs/swagger-ui/) for full field specifications per category. |
| `dont_publish_on_failed_images` | boolean | Both | No | `Default=false`. Set to true if you don't want to publish the ad if any of the images have an error. |
| `product_declaration` | string | Both | No | URL to a hosted "varudeklaration" in PDF format. |
| `blocket_ad_id` | string | Response | — | Blocket marketplace ad ID. Assigned asynchronously after publish. |
| `offer_id` | string | Response | — | Bytbil/Offer API ID. Only present for registered vehicle categories. |
| `api_version` | string | Response | — | API version used to create the ad (`v3` or `v4`) |
| `created` | string (ISO 8601) | Response | — | Timestamp when the ad was created |
| `updated` | string (ISO 8601) | Response | — | Timestamp when the ad was last updated |
| `log` | array of objects | Response | — | Action log entries (when included via query parameter). See Action Log section. |

##### `source_id`

Your ID for the ad. Each ad must have a unique `source_id`, since it is used to create, update, get and delete the ad.
We recommend using a UUID here to ensure uniqueness.

> **Important:** Once a `source_id` has been used for a dealer, it cannot be reused — even after the ad is deleted. This is because deleted ads are retained in the system (soft delete). Use UUIDs to avoid collisions.

##### `category_id`

| ID | Path / Name | API version |
| :---- | :---- | :---: |
| `1020` | Vehicles > Cars | V3, V4 |
| `1021` | Vehicles > Vans | V3, V4 |
| `1045` | Vehicles > Trailer | V3, V4 |
| `1060` | Vehicles > Boats | V4 |
| `1063` | Vehicles > Boats > Inflatable / RIB Boat | V3 |
| `1064` | Vehicles > Boats > Dinghy / Rowboat | V3 |
| `1065` | Vehicles > Boats > Kayak / Canoe | V3 |
| `1066` | Vehicles > Boats > Jet Ski | V3 |
| `1067` | Vehicles > Boats > Other | V3 |
| `1101` | Vehicles > Caravan | V3, V4 |
| `1102` | Vehicles > Motorhome | V3, V4 |
| `1121` | Vehicles > Mopeds & A-Tractors > Mopeds | V3, V4 |
| `1122` | Vehicles > Mopeds & A-Tractors > A-Tractors | V3, V4 |
| `1140` | Vehicles > Motorcycle | V3, V4 |
| `1143` | Vehicles > ATV | V3, V4 |
| `1180` | Vehicles > Snowmobile | V3, V4 |
| `1221` | Vehicles > Trucks, Machinery & Construction > Truck & Bus | V3 |
| `1222` | Vehicles > Forestry & Agricultural Machinery > Agricultural Machinery | V3 |
| `1223` | Vehicles > Trucks, Machinery & Construction > Construction Machinery | V3 |
| `1224` | Vehicles > Trucks, Machinery & Construction > Truck & Material Handling | V3 |
| `1225` | Vehicles > Forestry & Agricultural Machinery > Forestry Machinery | V3 |
| `1226` | Vehicles > Forestry & Agricultural Machinery > Ground Care Machinery | V3 |
| `1227` | Vehicles > Forestry & Agricultural Machinery > Agriculture Thresher | V4 |
| `1228` | Vehicles > Forestry & Agricultural Machinery > Agriculture Tractor | V4 |
| `1229` | Vehicles > Forestry & Agricultural Machinery > Agriculture Tools | V4 |
| `1321` | Vehicles > Trucks, Machinery & Construction > Bus | V4 |
| `1322` | Vehicles > Trucks, Machinery & Construction > Truck | V4 |
| `1323` | Vehicles > Trucks, Machinery & Construction > Construction | V4 |

For V4-only categories, see the [Category Reference](category-reference) for full field specifications and examples.

##### `price`

Array of objects representing prices for the ad. For registered vehicles, you can also send in price as leasing. Please see the [OpenAPI documentation](#openapi-documentation) for details.

| Type | Description |
| :---- | :---- |
| `list` | Regular list price |
| `reduced` | Reduced/sale price (not allowed on POST, only on PUT/PATCH) |
| `leasing` | Leasing price (only supported by registered vehicle categories) |

Example value:

```json
[{"type": "list", "amount": 7000, "currency": "SEK"}]
```

##### `image_urls`

Array of strings containing URLs to images for the ad. Accepted formats are JPG and PNG. The sort order of the images is the order of the list. Every time you want to update images, you need to send the complete list and it will replace the previous list. Already uploaded images that match an existing checksum will be internally reused.

Example value:

```json
[
    "https://cdn.example.com/image1.jpg",
    "https://cdn.example.com/image2.jpg"
]
```

##### `location`

Object with location parameters. If omitted or set to `null`, the ad's location defaults to your dealer's address configured in Blocket Admin. The API response will show `location: null` but the published ad will use the dealer's location.

There are three alternatives for setting ad location:

| Parameter name | Type | Required | Description |
| :---- | :---- | :---- | :---- |
| `latitude` + `longitude` | string | No | Decimal coordinates. Both must be provided together. Works for all categories. |
| `zipcode` | string | No | Zip/postal code without spaces. Works for all categories. |
| `lkf` | string | No | Swedish area code (LKF). See `lkf` section. Only works for non-registered vehicle categories (boats, agriculture, etc.). Not supported for registered vehicles (car, motorcycle, etc.). |

Example value:

```json
{"latitude": 59.53485752244251, "longitude": 16.71093897174057}
```

###### `lkf`

LKF is a Swedish abbreviation for "län, kommun, församling" (region, municipality, parish), and is a four or six digit area code (LK vs full LKF). Either the four or six digit version of the LKF can be used, where the latter increases location accuracy further and is particularly relevant to increase accuracy for ads located in Stockholm, Göteborg and Malmö. For example, the LK and full LKF for Vaksala in the city of Uppsala is:

`LK code: 0380`
`LKF code: 038004`

Where the LK code 0380 refers to the greater Uppsala-area and the six digit LKF code 038004 refers to Vaksala specifically. A complete list of LKF codes can be found [here](https://www.scb.se/contentassets/13ec5841d80045498d960d456e87ea78/fors2020_justerad.xls).

Please note that Blocket does not show exact coordinates, but resolves to a predefined geographical area.

##### `contact`

Object with contact information. Will override store information. **Required** for: boat, truck, bus, construction, and agriculture categories. **Must not be sent** for: car, transport, motorcycle, moped, snowmobile, ATV, camper, caravan, and trailer — including it will return a `400` error.

| Parameter name | Type | Required | Description |
| :---- | :---- | :---- | :---- |
| `name` | string | No | Seller's name |
| `phone` | string | No | Phone number (digits only, optionally prefixed with `+`, 8–16 characters) |
| `email` | string | Yes | Email address |

Example value:

```json
{"name": "Sir Henry Williamsworth III", "phone": "0700000000", "email": "email@example.com"}
```

##### `category_fields`

Every vehicle type has its own set of `category_fields` that describe the vehicle's attributes — for example `registration_number`, `brand`, `model`, `fuel`, `mileage` and `body_type` for cars, or `brand`, `model_year`, `powertrain`, `physics` and `equipments` for boats. These fields are required when creating a V4 ad and are what makes the ad searchable and filterable on blocket.se.

The available fields vary by vehicle type. See the [Category Reference](category-reference) for full field specifications and examples per category.

> **Tip:** For the most up-to-date field definitions and valid enum values, open `POST /v4/{vehicle_type}` (e.g. `POST /v4/car`) in the [Swagger UI](https://api.blocket.se/pro-import-api/docs/swagger-ui/) and click the **Schema** tab next to "Example Value". This shows exact field names, types, required/optional status and all accepted values for each category.

### GET /v4/ad — List ads

Use this endpoint to list your ad-requests and see progress/result of previous POST/PUT/DELETE operations. Each POST/PUT/DELETE on a certain `source_id` will appear as an individual entry. Log messages can be included with the help of the `include` field but only the last 100 messages will be provided. To get older log messages — see the endpoint for getting ad logs.

#### Parameters

| Name | Type | Description |
| :---- | :---- | :---- |
| `id` | Filter | Internal ad ID (UUID) |
| `state` | Filter | Values available: `created`, `deleted` |
| `source_id` | Filter | Client's reference ID (exact match) |
| `source_id__in` | Filter | Comma separated list of source IDs to include |
| `source_id__icontains` | Filter | Case-insensitive partial match on source ID |
| `dealer_code` | Filter | Customer identifier |
| `category_id` | Filter | Category ID (exact match) |
| `category_id__in` | Filter | Comma separated list of category IDs to include |
| `search` | Filter | Case-insensitive text search across the `title` and `body` fields |
| `blocket_ad_id` | Filter | Ad ID on Blocket |
| `blocket_ad_id__in` | Filter | Comma separated list of Blocket ad IDs to include |
| `registration_number` | Filter | Registration number of the vehicle (case-insensitive). Only works for registered vehicles. |
| `created__gt` | Filter | Format: `YYYY-MM-DD HH:MM:SS` |
| `created__gte` | Filter | Format: `YYYY-MM-DD HH:MM:SS` |
| `created__lt` | Filter | Format: `YYYY-MM-DD HH:MM:SS` |
| `created__lte` | Filter | Format: `YYYY-MM-DD HH:MM:SS` |
| `updated__gt` | Filter | Format: `YYYY-MM-DD HH:MM:SS` |
| `updated__gte` | Filter | Format: `YYYY-MM-DD HH:MM:SS` |
| `updated__lt` | Filter | Format: `YYYY-MM-DD HH:MM:SS` |
| `updated__lte` | Filter | Format: `YYYY-MM-DD HH:MM:SS` |
| `limit` | Setting | Limit results |
| `offset` | Setting | Offset results |
| `ordering` | Setting | Values available: `-created`, `created`, `-updated`, `updated`, `-source_id`, `source_id` |
| `fields` | Setting | Comma separated fields to include in response |
| `include` | Setting | Comma separated fields to include other than the defaults. Fields excluded by default in this endpoint are: `log.` **Note: only the 100 latest log messages are included.** To view more messages use `/v4/ad/{source_id}/log` endpoint. |

#### Example requests

```
GET /v4/ad?state=deleted
GET /v4/boat?state=created&ordering=-created&limit=10
GET /v4/ad?source_id__in=uuid-1,uuid-2,uuid-3&include=log
GET /v4/car?created__gte=2025-01-01 00:00:00&ordering=-created
```

### GET /v4/ad/{source_id}

Look up a specific ad based on source ID. Only includes the last 100 log messages.

### GET /v4/ad/{source_id}/log

Look up all log messages for an ad. This endpoint provides a paginated list of all log messages for an ad.

#### Parameters

| Name | Type | Description |
| :---- | :---- | :---- |
| `action` | Filter | Values available: create update bump boost delete handle\_media publish unpublish |
| `state` | Filter | Values available: processing done error |
| `request_id` | Filter | Filter by request ID (UUID) to see only log entries from a specific API call |
| `limit` | Setting | Limit results |
| `offset` | Setting | Offset results |
| `ordering` | Setting | Values available: -created created |

### PUT /v4/{vehicle_type}/{source_id} — Update an ad

Use this endpoint to update an ad. Same signature as ad creation except for `source_id` which is provided in the path instead of the body. The ads contents will be updated but it will not appear as new. To renew an ad — see `/v4/ad/{source_id}/bump` endpoint.

> **Important — merge semantics:** Both PUT and PATCH use **deep merge** semantics. This differs from the HTTP standard where PUT replaces the entire resource. In this API, fields not included in the request body are **preserved**, not cleared. Nested objects such as `category_fields` are also merged recursively.
>
> This means PUT and PATCH are functionally equivalent — both perform a partial update. To clear a field, explicitly set it to `null` (for nullable fields).

You can use the PUT method to revive a deleted ad in unregistered vehicle categories (excluding registered vehicles such as cars and vans).

### PATCH /v4/{vehicle_type}/{source_id} — Update part of an ad

Use this endpoint to update part of an ad. Same signature as ad creation except for `source_id` which is provided in the path instead of the body. The ads contents will be updated but it will not appear as new. To renew an ad — see `/v4/ad/{source_id}/bump` endpoint.

> **Note:** PATCH uses the same deep merge behavior as PUT — see the PUT section above for details.

You can use the PATCH method to revive a deleted ad in unregistered vehicle categories (excluding registered vehicles such as cars and vans).

### DELETE /v4/ad/{source_id} — Delete an ad

Request to delete an ad. Like all write operations, deletion is **asynchronous** — the endpoint returns immediately while the actual deletion is processed in the background.

The response returns the ad with `state: "created"`. This is expected. The state transitions to `"deleted"` once the background worker has unpublished the ad from all marketplaces. To confirm deletion, poll `GET /v4/ad/{source_id}` and look for a log entry with `action: delete` and `state: done`.

### GET /v4/ad/{source_id}/bump — Renew an ad

Calling this endpoint will make the ad appear as new again. Charges apply.

**Prerequisites:** The ad must be visible (`visible=true`). The dealer must have bump permissions for at least one marketplace.

### GET /v4/ad/{source_id}/pole_position — Set pole position on an ad

Calling this endpoint will make the ad appear first in the search result. If several ads with pole position match the end user's search filter, only one is shown. Pole position lasts for 3 days. More information [here](https://www.blocket.se/for-foretag/fordon/pole-position). Charges apply.

**Prerequisites:** The ad must be visible (`visible=true`) and must not already have an active Pole Position. Only available for registered vehicle categories (Blocket only).

## Vehicle field values {#vehicle-field-values}

Valid values for fields like `body_type`, `brand` and `fuel` are listed directly in the [Swagger UI](swagger-ui/) schema for each category. Open `POST /v4/{vehicle_type}` (e.g. `POST /v4/car`), click **Schema**, and expand `category_fields` to see the accepted enum values.

You can also discover attributes and their valid values programmatically:

    GET /v4/vehicles/{vehicle_type}/attributes

Returns a list of queryable attributes for the given vehicle type. Each entry has an `id` and a human-readable `name`:

```json
[
    {"id": "body_type", "name": "Body Type"},
    {"id": "brand", "name": "Brand"},
    {"id": "powertrain.fuel", "name": "Powertrain Fuel"}
]
```

To retrieve the allowed values for a specific attribute:

    GET /v4/vehicles/{vehicle_type}/{attribute}

Returns a list of valid values, each with an `id` (slug) and `name`:

```json
[
    {"id": "volvo", "name": "Volvo"},
    {"id": "bmw", "name": "BMW"}
]
```

For example, to list all valid brands for boats: `GET /v4/vehicles/boat/brand`

For cars, you can also look up models for a specific brand:

    GET /v4/vehicles/car/models?brand={brand}

# V4 API

> **Use `/v4/{vehicle_type}/` for new integrations.** All V3 endpoints (`/v3/ad`) remain fully supported.

## V4 Endpoint Overview

### Generic endpoints

| Method | Path | Description |
| :---- | :---- | :---- |
| `GET` | `/v4/ad` | List ads (returns both V3 and V4 ads) |
| `GET` | `/v4/ad/{source_id}` | Get specific ad |
| `DELETE` | `/v4/ad/{source_id}` | Delete ad |
| `GET` | `/v4/ad/{source_id}/log` | Get ad logs |
| `GET` | `/v4/ad/{source_id}/bump` | Renew an ad |
| `GET` | `/v4/ad/{source_id}/pole_position` | Set pole position on an ad |
| `GET` | `/v4/ad/{source_id}/retry` | Re-queue ad for processing |

### Enum value lookup

| Method | Path | Description |
| :---- | :---- | :---- |
| `GET` | `/v4/vehicles/{vehicle_type}/attributes` | List available attributes for a vehicle type |
| `GET` | `/v4/vehicles/{vehicle_type}/{attribute}` | Get valid values for an attribute |

### Typed endpoints (`{vehicle_type}` e.g. `car`, `boat`, `truck`, etc.)

| Method | Path | Description |
| :---- | :---- | :---- |
| `POST` | `/v4/{vehicle_type}` | Create new ad |
| `GET` | `/v4/{vehicle_type}` | List ads for category |
| `POST` | `/v4/{vehicle_type}/validate` | Validate payload without saving |
| `GET` | `/v4/{vehicle_type}/{source_id}` | Get specific ad |
| `PUT` | `/v4/{vehicle_type}/{source_id}` | Full update |
| `PATCH` | `/v4/{vehicle_type}/{source_id}` | Partial update |
| `DELETE` | `/v4/{vehicle_type}/{source_id}` | Delete ad |
| `POST` | `/v4/{vehicle_type}/{source_id}/migrate` | Migrate V3 ad to V4 (see [Migrating V3 ads to V4](#migrating-v3-ads-to-v4)) |

Available vehicle types: `car`, `transport`, `motorcycle`, `moped`, `snowmobile`, `atv`, `camper`, `caravan`, `trailer`, `boat`, `agriculture-thresher`, `agriculture-tractor`, `agriculture-tools`, `bus`, `truck`, `construction`

## V4 Backward Compatibility

If you have existing V3 ads, V4 endpoints handle them as follows. Some categories changed schema between V3 and V4 (e.g. Moped, Camper, Boats, Agriculture, Truck & Bus) — these require explicit migration before they can be updated via V4.

| Operation | Compatible (Car, MC, etc.) | Incompatible (Moped, Camper, Boats, etc.) |
| :---- | :---- | :---- |
| **GET** | Works | Works |
| **DELETE** | Works | Works |
| **PUT / PATCH** | Auto-converts to V4 | Blocked — use `/v4/{vehicle_type}/{source_id}/migrate` first |

## Migrating V3 ads to V4

### Compatible Categories (Car, Motorcycle, etc.)

Migration is **automatic** — simply update the ad via a V4 endpoint and it will be converted to V4.

### Incompatible Categories (Moped, Camper, Caravan, Trailer, Boats, Agriculture, Truck & Bus)

You have two options:

**Option A: Use the typed migration endpoint (recommended)**

`POST /v4/{vehicle_type}/{source_id}/migrate` converts the ad in-place. The ad ID, source ID and history are preserved. Requires a complete V4 payload with all required `category_fields`. Do **not** include `category_id` in the request body — it is determined by the endpoint URL.

Available migration endpoints:

| V3 Category | Endpoint | Target V4 category |
| :---- | :---- | :---- |
| Moped (1121) | `POST /v4/moped/{source_id}/migrate` | 1121 |
| Camper (1102) | `POST /v4/camper/{source_id}/migrate` | 1102 |
| Caravan (1101) | `POST /v4/caravan/{source_id}/migrate` | 1101 |
| Trailer (1045) | `POST /v4/trailer/{source_id}/migrate` | 1045 |
| Boats (1061–1067) | `POST /v4/boat/{source_id}/migrate` | 1060 (unified) |
| Agriculture Tools (1225, 1226) | `POST /v4/agriculture-tools/{source_id}/migrate` | 1229 (unified) |
| Agriculture (1222) → Thresher | `POST /v4/agriculture-thresher/{source_id}/migrate` | 1227 |
| Agriculture (1222) → Tractor | `POST /v4/agriculture-tractor/{source_id}/migrate` | 1228 |
| Truck & Bus (1221) → Bus | `POST /v4/bus/{source_id}/migrate` | 1321 |
| Truck & Bus (1221) → Truck | `POST /v4/truck/{source_id}/migrate` | 1322 |
| Construction (1223) | `POST /v4/construction/{source_id}/migrate` | 1323 |

> **Note:** For categories that were split in V4 (Agriculture 1222 → Thresher/Tractor, Truck & Bus 1221 → Bus/Truck), choose the endpoint that matches the target category. If a V3 ad was created in the wrong category (e.g. a tractor listed as a thresher), it cannot be corrected via migration — you must delete the ad and create a new one in the correct category.

**Option B: DELETE + POST**

Delete the V3 ad and create a new V4 ad with a new `source_id`. The internal ad ID and history will also be new.

### Migration Strategy

We recommend a **gradual migration**: start using `/v4/{vehicle_type}/` for new ads, keep existing V3 ads unchanged, and migrate them at your convenience. V3 endpoints remain fully supported — there is no deadline to migrate.

## V4 FAQ

**Do I need to migrate all ads at once?**
No. V3 ads continue to work. Migrate at your own pace.

**Can I still use V3 endpoints?**
Yes. V3 endpoints remain available. New features will be V4-only.

**Can I read V3 ads using V4 endpoints?**
Yes. `GET /v4/ad` returns both V3 and V4 ads.

**Do I need to change my authentication?**
No. The same API token works for both V3 and V4.

# Migration from file imports via FTP {#migration-from-file-imports-via-ftp}

The Import-API is very different from the legacy file imports where you send a file via FTP with the entire stock and wait for that file to be imported. The imports via FTP require you to send all the stock information on every update, and images are sent separately either as raw image files or via URLs in json-files.

The API is a modern replacement to the previous file imports via FTP which is now being deprecated.

### **Migrating to the API** {#migrating-to-the-api}

When migrating to the API, all existing ads currently managed in **Blocket Admin** must be re-submitted to the API using `POST` requests. This is necessary to establish the `source_id` relationship between the API-managed ad and the corresponding ad in Blocket Admin. Matching is based on licence plate, including Q based licence plates allocated automatically when the ad was created manually in Blocket Admin.

During this initial migration, you are also required to provide a list of image URLs via the `image_urls` field. Below follows a short recap and caveats you need to be aware of when migrating from legacy file imports or building a new integration.

**Source ID**

As described in the documentation above, every ad needs a source_id, this is your identifier when updating or deleting the ad after creation. The source_id needs to be unique within the customer it belongs to. The source_id can be any string of choice.

**Images**

As described in the documentation above, images are sent as a list of URLs in the ad payload under the field named image\_urls. The images will be downloaded by the API when creating or updating the ad. There is no possibility to upload raw image files to the API, you need to provide URLs to your own publicly accessible image storage or CDN.

#### **Overwriting Data**

All data submitted through the API will **overwrite** the existing data in Blocket Admin. Unlike the previous file import system, there is **no concept of import locks** — any ad data submitted via the API is considered the source of truth.

#### **One-Way Sync**

Any changes made directly in Blocket Admin **will not** be reflected when retrieving the ad via the API. The API only exposes data that was created or updated through the API itself. For consistency and data integrity, **all ad modifications should preferably be performed via the API**.

#### **File Imports Deprecated**

Once the migration to the API is complete, the legacy file import functionality will be **shut down**.

#### **Step by step guide**

1. Stop sending legacy import files.
2. Send a POST request with source_id, licence\_plate etc for each existing ad to connect the existing ads to the API. See [POST /ad section](#post-/ad---create-an-ad).
3. Manage all existing and new ads through the API.
