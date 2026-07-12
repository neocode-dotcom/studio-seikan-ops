"use client";

// Orquestador del Módulo 1. Alterna kanban / tabla sin recargar (estado local,
// mismo route), gestiona alta, detalle y el flujo de descarte con motivo.
import { useMemo, useState } from "react";
import {
  useProspectos,
  useTodasNotas,
  useCambiarEtapa,
} from "@/hooks/useProspectos";
import type { Prospecto } from "@/lib/types";
import type { EtapaSlug } from "@/lib/etapas";
import { estaEstancado } from "@/lib/utils";
import { KanbanBoard } from "./KanbanBoard";
import { TablaProspectos } from "./TablaProspectos";
import { NuevoProspectoModal } from "./NuevoProspectoModal";
import { ProspectoDrawer } from "./ProspectoDrawer";
import { DescartarModal } from "./DescartarModal";

type Vista = "kanban" | "tabla";

export function ProspectosView() {
  const prospectos = useProspectos();
  const notas = useTodasNotas();
  const cambiar = useCambiarEtapa();

  const [vista, setVista] = useState<Vista>("kanban");
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [descartar, setDescartar] = useState<Prospecto | null>(null);

  const lista = prospectos.data ?? [];

  // Mapa prospecto -> created_at de su última nota (para la regla "Estancado").
  const ultimaNotaPorProspecto = useMemo(() => {
    const m = new Map<string, string>();
    // useTodasNotas viene ordenado desc: la primera vista por prospecto es la última nota.
    for (const n of notas.data ?? []) {
      if (!m.has(n.prospecto_id)) m.set(n.prospecto_id, n.created_at);
    }
    return m;
  }, [notas.data]);

  const estancadoDe = (p: Prospecto) =>
    estaEstancado(p, ultimaNotaPorProspecto.get(p.id) ?? null);

  const seleccionado = selectedId
    ? lista.find((p) => p.id === selectedId) ?? null
    : null;

  function moverEtapa(id: string, etapa: EtapaSlug) {
    cambiar.mutate({ id, etapa });
  }

  function confirmarDescarte(motivo: string) {
    if (!descartar) return;
    cambiar.mutate(
      { id: descartar.id, etapa: "descartado", motivo_descarte: motivo },
      { onSettled: () => setDescartar(null) },
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl text-paper">Prospectos</h1>
          <p className="label-field mt-0.5">
            {lista.length} en pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-[var(--border)] p-0.5">
            {(["kanban", "tabla"] as Vista[]).map((v) => (
              <button
                key={v}
                onClick={() => setVista(v)}
                className={`rounded px-3 py-1 text-sm capitalize transition-colors ${
                  vista === v
                    ? "bg-[rgba(166,54,42,0.16)] text-stamp-light"
                    : "text-muted hover:text-paper"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setNuevoOpen(true)}
          >
            + Nuevo prospecto
          </button>
        </div>
      </div>

      {prospectos.isLoading ? (
        <p className="text-muted">Cargando prospectos…</p>
      ) : prospectos.isError ? (
        <p className="text-stamp-light">
          Error al cargar. Revisa la conexión con Supabase.
        </p>
      ) : vista === "kanban" ? (
        <KanbanBoard
          prospectos={lista}
          estancadoDe={estancadoDe}
          onAbrir={(p) => setSelectedId(p.id)}
          onMoverEtapa={moverEtapa}
          onSoltarEnDescartado={(p) => setDescartar(p)}
        />
      ) : (
        <TablaProspectos
          prospectos={lista}
          estancadoDe={estancadoDe}
          onAbrir={(p) => setSelectedId(p.id)}
        />
      )}

      <NuevoProspectoModal
        open={nuevoOpen}
        onClose={() => setNuevoOpen(false)}
      />

      {seleccionado && (
        <ProspectoDrawer
          prospecto={seleccionado}
          onClose={() => setSelectedId(null)}
        />
      )}

      <DescartarModal
        open={!!descartar}
        nombreDespacho={descartar?.nombre_despacho}
        pendiente={cambiar.isPending}
        onCancel={() => setDescartar(null)}
        onConfirm={confirmarDescarte}
      />
    </div>
  );
}
