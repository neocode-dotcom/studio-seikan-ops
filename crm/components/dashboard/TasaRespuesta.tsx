"use client";

// Tasa de respuesta por canal. Se calcula en JS (volumen bajo) cruzando
// historial_etapas + prospectos:
//   - "contactado" = el prospecto alcanzó alguna etapa de orden >= 2 (excepto descartado)
//   - "respondió"  = alcanzó alguna etapa de orden >= 3 (excepto descartado)
// Se agrupa por canal_origen. % respuesta = respondieron / contactados.
import { useMemo } from "react";
import { useProspectos, useTodoHistorial } from "@/hooks/useProspectos";
import { ordenEtapa } from "@/lib/etapas";
import { labelCanal } from "@/lib/canales";

interface Fila {
  canal: string;
  contactados: number;
  respondieron: number;
}

export function TasaRespuesta() {
  const prospectos = useProspectos();
  const historial = useTodoHistorial();

  const filas = useMemo<Fila[]>(() => {
    // Orden máximo alcanzado por prospecto (excluyendo 'descartado').
    const maxOrden = new Map<string, number>();
    const acumula = (prospectoId: string, etapa: string) => {
      if (etapa === "descartado") return;
      const o = ordenEtapa(etapa);
      maxOrden.set(prospectoId, Math.max(maxOrden.get(prospectoId) ?? 0, o));
    };
    for (const h of historial.data ?? []) acumula(h.prospecto_id, h.etapa);
    // Union con la etapa actual por si algún registro faltara.
    for (const p of prospectos.data ?? []) acumula(p.id, p.etapa);

    const porCanal = new Map<string, Fila>();
    for (const p of prospectos.data ?? []) {
      const o = maxOrden.get(p.id) ?? 0;
      const contactado = o >= 2;
      if (!contactado) continue;
      const respondio = o >= 3;
      const f =
        porCanal.get(p.canal_origen) ??
        { canal: p.canal_origen, contactados: 0, respondieron: 0 };
      f.contactados += 1;
      if (respondio) f.respondieron += 1;
      porCanal.set(p.canal_origen, f);
    }
    return Array.from(porCanal.values()).sort(
      (a, b) => b.contactados - a.contactados,
    );
  }, [prospectos.data, historial.data]);

  return (
    <section className="card p-4">
      <h2 className="mb-3 text-base text-paper">Tasa de respuesta por canal</h2>
      {filas.length === 0 ? (
        <p className="text-sm text-muted">
          Aún no hay prospectos contactados. La tasa aparecerá cuando muevas
          prospectos a &quot;Contactado&quot; o más adelante.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="label-field border-b border-[var(--border)]">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium">Canal</th>
              <th className="px-2 py-1.5 text-right font-medium">Contactados</th>
              <th className="px-2 py-1.5 text-right font-medium">Respondieron</th>
              <th className="px-2 py-1.5 text-right font-medium">% respuesta</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => {
              const pct = f.contactados
                ? Math.round((f.respondieron / f.contactados) * 100)
                : 0;
              return (
                <tr
                  key={f.canal}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="px-2 py-1.5 text-paper">
                    {labelCanal(f.canal)}
                  </td>
                  <td className="mono px-2 py-1.5 text-right text-muted">
                    {f.contactados}
                  </td>
                  <td className="mono px-2 py-1.5 text-right text-muted">
                    {f.respondieron}
                  </td>
                  <td className="mono px-2 py-1.5 text-right text-paper">
                    {pct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
