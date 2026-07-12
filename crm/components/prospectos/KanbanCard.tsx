"use client";

// Tarjeta de prospecto arrastrable. El sensor exige mover >6px para iniciar el
// drag, así que un click limpio abre el detalle sin disparar el arrastre.
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Prospecto } from "@/lib/types";
import { labelCanal } from "@/lib/canales";
import { EstancadoBadge, ScorePrioridad } from "@/components/ui/Badges";

export function KanbanCard({
  prospecto,
  estancado,
  onAbrir,
}: {
  prospecto: Prospecto;
  estancado: boolean;
  onAbrir: (p: Prospecto) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: prospecto.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onAbrir(prospecto)}
      className={`card cursor-grab active:cursor-grabbing p-2.5 ${
        estancado ? "border-stamp" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm leading-tight text-paper">
          {prospecto.nombre_despacho}
        </span>
        {estancado && <EstancadoBadge />}
      </div>
      <div className="mt-1 text-xs text-muted">{prospecto.nombre_contacto}</div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="label-field text-[0.6rem] normal-case">
          {prospecto.ciudad} · {labelCanal(prospecto.canal_origen)}
        </span>
        <ScorePrioridad score={prospecto.score_prioridad} />
      </div>
    </div>
  );
}
