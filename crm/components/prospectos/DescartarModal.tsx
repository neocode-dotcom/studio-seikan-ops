"use client";

// Modal obligatorio de motivo al mover un prospecto a "Descartado".
// Cancelar NO cambia la etapa (el kanban defiere la mutación hasta confirmar).
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { MOTIVOS_DESCARTE } from "@/lib/opciones";

export function DescartarModal({
  open,
  nombreDespacho,
  onCancel,
  onConfirm,
  pendiente,
  motivoInicial = "no_responde",
}: {
  open: boolean;
  nombreDespacho?: string;
  onCancel: () => void;
  onConfirm: (motivo: string) => void;
  pendiente?: boolean;
  motivoInicial?: string;
}) {
  const [motivo, setMotivo] = useState(motivoInicial);

  return (
    <Modal open={open} onClose={onCancel} title="Descartar prospecto" maxWidth="max-w-md">
      <p className="mb-3 text-sm text-muted">
        {nombreDespacho ? (
          <>
            Vas a descartar <span className="text-paper">{nombreDespacho}</span>.
          </>
        ) : (
          "Selecciona el motivo del descarte."
        )}{" "}
        El motivo es obligatorio.
      </p>
      <label className="label-field mb-1 block">Motivo *</label>
      <select
        className="field"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      >
        {MOTIVOS_DESCARTE.map((m) => (
          <option key={m.slug} value={m.slug}>
            {m.label}
          </option>
        ))}
      </select>
      <div className="mt-4 flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button
          className="btn btn-primary"
          disabled={pendiente}
          onClick={() => onConfirm(motivo)}
        >
          {pendiente ? "Descartando…" : "Descartar"}
        </button>
      </div>
    </Modal>
  );
}
