// Badges reutilizables: etapa (con color de marca) y "Estancado".
import { getEtapa } from "@/lib/etapas";

export function EtapaBadge({ slug }: { slug: string }) {
  const etapa = getEtapa(slug);
  if (!etapa) return <span className="mono text-xs">{slug}</span>;
  return (
    <span
      className="mono inline-flex items-center rounded px-1.5 py-0.5 text-[0.68rem] font-medium"
      style={{ color: etapa.color, background: etapa.bg }}
    >
      {etapa.label}
    </span>
  );
}

export function EstancadoBadge() {
  return <span className="badge-estancado">Estancado</span>;
}

export function ScorePrioridad({ score }: { score: number | null }) {
  if (!score) return <span className="text-muted-dark mono text-xs">—</span>;
  return (
    <span className="mono text-xs text-paper" title={`Prioridad ${score}/5`}>
      {"●".repeat(score)}
      <span className="text-muted-dark">{"○".repeat(5 - score)}</span>
    </span>
  );
}
