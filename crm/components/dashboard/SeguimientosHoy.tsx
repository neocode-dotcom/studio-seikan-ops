"use client";

// Tarjeta "Seguimientos de hoy": prospectos con fecha_proximo_seguimiento <= hoy,
// excluyendo cliente_firmado y descartado. Lista accionable con botón "Completar".
import { useMemo, useState } from "react";
import {
  useProspectos,
  useSeguimientosPendientes,
} from "@/hooks/useProspectos";
import type { Prospecto, Seguimiento } from "@/lib/types";
import { seguimientoVencido, formatFecha } from "@/lib/utils";
import { labelCanal } from "@/lib/canales";
import { CompletarSeguimientoDialog } from "./CompletarSeguimientoDialog";

export function SeguimientosHoy() {
  const prospectos = useProspectos();
  const pendientes = useSeguimientosPendientes();
  const [activo, setActivo] = useState<{
    prospecto: Prospecto;
    seguimiento: Seguimiento;
  } | null>(null);

  // Seguimiento pendiente de menor número por prospecto (el que toca completar).
  const pendientePorProspecto = useMemo(() => {
    const m = new Map<string, Seguimiento>();
    for (const s of pendientes.data ?? []) {
      const actual = m.get(s.prospecto_id);
      if (!actual || s.numero < actual.numero) m.set(s.prospecto_id, s);
    }
    return m;
  }, [pendientes.data]);

  const items = useMemo(() => {
    return (prospectos.data ?? []).filter(
      (p) =>
        p.etapa !== "cliente_firmado" &&
        p.etapa !== "descartado" &&
        seguimientoVencido(p.fecha_proximo_seguimiento),
    );
  }, [prospectos.data]);

  return (
    <section className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base text-paper">Seguimientos de hoy</h2>
        <span className="mono text-sm text-stamp-light">{items.length}</span>
      </div>

      {prospectos.isLoading ? (
        <p className="text-sm text-muted">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">
          Nada pendiente hoy. Al día con los seguimientos.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((p) => {
            const seg = pendientePorProspecto.get(p.id) ?? null;
            return (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded border border-[var(--border)] px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm text-paper">
                    {p.nombre_despacho}
                  </div>
                  <div className="label-field truncate">
                    {p.nombre_contacto} · {labelCanal(p.canal_origen)} ·{" "}
                    {formatFecha(p.fecha_proximo_seguimiento)}
                  </div>
                </div>
                <button
                  className="btn btn-jade shrink-0 text-xs"
                  disabled={!seg}
                  title={seg ? "" : "Sin seguimiento pendiente registrado"}
                  onClick={() =>
                    seg && setActivo({ prospecto: p, seguimiento: seg })
                  }
                >
                  Completar
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {activo && (
        <CompletarSeguimientoDialog
          prospecto={activo.prospecto}
          seguimiento={activo.seguimiento}
          onClose={() => setActivo(null)}
        />
      )}
    </section>
  );
}
