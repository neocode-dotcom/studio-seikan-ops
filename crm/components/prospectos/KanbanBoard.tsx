"use client";

// Tablero kanban con las 8 columnas del embudo y drag-and-drop.
// Drop en cualquier columna (salvo "Descartado") dispara el UPDATE de etapa
// de inmediato (optimista, vía useCambiarEtapa). Drop en "Descartado" NO muta:
// avisa al padre para abrir el modal obligatorio de motivo.
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import type { Prospecto } from "@/lib/types";
import { ETAPAS, type EtapaSlug } from "@/lib/etapas";
import { KanbanCard } from "./KanbanCard";
import { labelCanal } from "@/lib/canales";

function Columna({
  slug,
  label,
  color,
  bg,
  children,
  count,
}: {
  slug: EtapaSlug;
  label: string;
  color: string;
  bg: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: slug });
  return (
    <div
      ref={setNodeRef}
      className="flex w-64 shrink-0 flex-col rounded-lg"
      style={{
        background: isOver ? bg : "rgba(255,255,255,0.02)",
        outline: isOver ? `1px dashed ${color}` : "1px solid var(--border)",
      }}
    >
      <div
        className="flex items-center justify-between rounded-t-lg px-3 py-2"
        style={{ borderBottom: `2px solid ${color}` }}
      >
        <span className="text-sm text-paper">{label}</span>
        <span className="mono text-xs" style={{ color }}>
          {count}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2">{children}</div>
    </div>
  );
}

export function KanbanBoard({
  prospectos,
  estancadoDe,
  onAbrir,
  onMoverEtapa,
  onSoltarEnDescartado,
}: {
  prospectos: Prospecto[];
  estancadoDe: (p: Prospecto) => boolean;
  onAbrir: (p: Prospecto) => void;
  onMoverEtapa: (id: string, etapa: EtapaSlug) => void;
  onSoltarEnDescartado: (p: Prospecto) => void;
}) {
  const [activo, setActivo] = useState<Prospecto | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function onDragStart(e: DragStartEvent) {
    const p = prospectos.find((x) => x.id === e.active.id);
    setActivo(p ?? null);
  }

  function onDragEnd(e: DragEndEvent) {
    setActivo(null);
    const { active, over } = e;
    if (!over) return;
    const id = active.id as string;
    const destino = over.id as EtapaSlug;
    const prospecto = prospectos.find((p) => p.id === id);
    if (!prospecto || prospecto.etapa === destino) return;

    if (destino === "descartado") {
      onSoltarEnDescartado(prospecto);
      return;
    }
    onMoverEtapa(id, destino);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="scroll-thin flex gap-3 overflow-x-auto pb-3">
        {ETAPAS.map((etapa) => {
          const items = prospectos.filter((p) => p.etapa === etapa.slug);
          return (
            <Columna
              key={etapa.slug}
              slug={etapa.slug}
              label={etapa.label}
              color={etapa.color}
              bg={etapa.bg}
              count={items.length}
            >
              {items.map((p) => (
                <KanbanCard
                  key={p.id}
                  prospecto={p}
                  estancado={estancadoDe(p)}
                  onAbrir={onAbrir}
                />
              ))}
            </Columna>
          );
        })}
      </div>

      <DragOverlay>
        {activo ? (
          <div className="card p-2.5 opacity-95">
            <div className="text-sm text-paper">{activo.nombre_despacho}</div>
            <div className="text-xs text-muted">
              {activo.ciudad} · {labelCanal(activo.canal_origen)}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
