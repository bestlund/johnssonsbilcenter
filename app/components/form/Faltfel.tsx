/** Litet fältfel under ett formulärfält. Renderar inget om det inte finns fel. */
export default function Faltfel({
  id,
  meddelande,
}: {
  id?: string;
  meddelande?: string;
}) {
  if (!meddelande) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-danger">
      {meddelande}
    </p>
  );
}
