// Motivo del sello migratorio (docs/01 sección 5): dos círculos concéntricos
// con rotación base de -8deg para simular el ángulo imperfecto de un sello real.
// Usa currentColor para heredar el rojo-sello desde la clase contenedora.
export function SelloIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
      style={{ transform: "rotate(-8deg)" }}
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" opacity="0.55" />
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="3" opacity="0.9" />
      <path
        d="M34 50 L45 61 L67 39"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
