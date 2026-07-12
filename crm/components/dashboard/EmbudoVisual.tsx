"use client";

// Embudo visual: conteo por cada una de las 8 etapas (barras horizontales).
import { useMemo } from "react";
import { useProspectos } from "@/hooks/useProspectos";
import { ETAPAS } from "@/lib/etapas";

export function EmbudoVisual() {
  const prospectos = useProspectos();

  const conteos = useMemo(() => {
    const m = new Map<string, number>(ETAPAS.map((e) => [e.slug, 0]));
    for (const p of prospectos.data ?? []) {
      m.set(p.etapa, (m.get(p.etapa) ?? 0) + 1);
    }
    return m;
  }, [prospectos.data]);

  const max = Math.max(1, ...ETAPAS.map((e) => conteos.get(e.slug) ?? 0));

  return (
    <section className="card p-4">
      <h2 className="mb-3 text-base text-paper">Embudo</h2>
      <div className="flex flex-col gap-2">
        {ETAPAS.map((et) => {
          const n = conteos.get(et.slug) ?? 0;
          const pct = (n / max) * 100;
          return (
            <div key={et.slug} className="flex items-center gap-3">
              <span className="w-36 shrink-0 text-xs text-muted">
                {et.label}
              </span>
              <div className="h-5 flex-1 overflow-hidden rounded bg-[rgba(255,255,255,0.04)]">
                <div
                  className="flex h-full items-center rounded"
                  style={{
                    width: `${Math.max(pct, n > 0 ? 6 : 0)}%`,
                    background: et.color,
                  }}
                />
              </div>
              <span className="mono w-6 shrink-0 text-right text-xs text-paper">
                {n}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
