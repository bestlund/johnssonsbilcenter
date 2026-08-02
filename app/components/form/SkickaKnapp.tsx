/**
 * Submit-knapp för lead-formulären. Tar `pending` från formulärets
 * `useActionState` (i stället för useFormStatus, eftersom formulärets action
 * wrappas för att sätta anti-spam-fältet `dt` — då blir useActionState-pending
 * den pålitliga signalen).
 */
export default function SkickaKnapp({
  pending = false,
  children = "Skicka",
  className = "btn btn-primary w-full",
}: {
  pending?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Skickar…" : children}
    </button>
  );
}
