"use client";

// Diálogo al completar un seguimiento del día. Siempre marca el seguimiento
// actual como completado y pregunta qué sigue: avanzar de etapa o agendar otro.
// Regla de negocio: al completar el 3er seguimiento (+14 días) sin respuesta,
// la acción principal es "Descartar (no responde)"; la secundaria es agendar
// un seguimiento manual con fecha libre.
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  useCompletarSeguimiento,
  useCambiarEtapa,
  useCrearSeguimientoManual,
} from "@/hooks/useProspectos";
import type { Prospecto, Seguimiento } from "@/lib/types";
import { ETAPAS, type EtapaSlug } from "@/lib/etapas";

function fechaMasDias(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function CompletarSeguimientoDialog({
  prospecto,
  seguimiento,
  onClose,
}: {
  prospecto: Prospecto;
  seguimiento: Seguimiento;
  onClose: () => void;
}) {
  const completar = useCompletarSeguimiento();
  const cambiar = useCambiarEtapa();
  const crearManual = useCrearSeguimientoManual();

  const [etapaDestino, setEtapaDestino] = useState<EtapaSlug>("respondio");
  const [fechaManual, setFechaManual] = useState(fechaMasDias(7));
  const [trabajando, setTrabajando] = useState(false);

  const esTercero = seguimiento.numero >= 3;

  async function completarSolo() {
    setTrabajando(true);
    await completar.mutateAsync(seguimiento.id);
    onClose();
  }

  async function avanzarEtapa() {
    setTrabajando(true);
    await completar.mutateAsync(seguimiento.id);
    await cambiar.mutateAsync({ id: prospecto.id, etapa: etapaDestino });
    onClose();
  }

  async function descartarNoResponde() {
    setTrabajando(true);
    await completar.mutateAsync(seguimiento.id);
    await cambiar.mutateAsync({
      id: prospecto.id,
      etapa: "descartado",
      motivo_descarte: "no_responde",
    });
    onClose();
  }

  async function agendarManual() {
    setTrabajando(true);
    await completar.mutateAsync(seguimiento.id);
    await crearManual.mutateAsync({
      prospecto_id: prospecto.id,
      numero: Math.max(seguimiento.numero + 1, 4),
      fecha_programada: new Date(fechaManual).toISOString(),
    });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Seguimiento #${seguimiento.numero} · ${prospecto.nombre_despacho}`}
      maxWidth="max-w-md"
    >
      <p className="mb-4 text-sm text-muted">
        Al confirmar cualquier acción se marca este seguimiento como completado.
        {esTercero
          ? " Es el 3er seguimiento (+14 días): si no ha respondido, lo recomendable es descartar."
          : " ¿El prospecto respondió y avanza de etapa, o solo cierras este seguimiento?"}
      </p>

      {esTercero ? (
        <div className="flex flex-col gap-4">
          {/* Acción principal para el 3er seguimiento */}
          <button
            className="btn btn-primary"
            disabled={trabajando}
            onClick={descartarNoResponde}
          >
            Descartar (no responde)
          </button>

          <div className="border-t border-[var(--border)] pt-3">
            <p className="label-field mb-2">O si prefieres seguir insistiendo</p>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="field w-auto"
                value={fechaManual}
                onChange={(e) => setFechaManual(e.target.value)}
              />
              <button
                className="btn btn-ghost text-xs"
                disabled={trabajando}
                onClick={agendarManual}
              >
                Agendar seguimiento manual
              </button>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-3">
            <p className="label-field mb-2">O avanza de etapa</p>
            <div className="flex items-center gap-2">
              <select
                className="field w-auto"
                value={etapaDestino}
                onChange={(e) => setEtapaDestino(e.target.value as EtapaSlug)}
              >
                {ETAPAS.filter((e) => e.slug !== "descartado").map((et) => (
                  <option key={et.slug} value={et.slug}>
                    {et.label}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-jade text-xs"
                disabled={trabajando}
                onClick={avanzarEtapa}
              >
                Completar y mover
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Avanzar de etapa */}
          <div>
            <p className="label-field mb-2">El prospecto avanza de etapa</p>
            <div className="flex items-center gap-2">
              <select
                className="field w-auto"
                value={etapaDestino}
                onChange={(e) => setEtapaDestino(e.target.value as EtapaSlug)}
              >
                {ETAPAS.filter((e) => e.slug !== "descartado").map((et) => (
                  <option key={et.slug} value={et.slug}>
                    {et.label}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-jade text-xs"
                disabled={trabajando}
                onClick={avanzarEtapa}
              >
                Completar y mover
              </button>
            </div>
          </div>

          {/* Solo completar: el siguiente automático ya está agendado */}
          <div className="border-t border-[var(--border)] pt-3">
            <button
              className="btn btn-primary w-full"
              disabled={trabajando}
              onClick={completarSolo}
            >
              Solo completar (el siguiente ya está agendado)
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
