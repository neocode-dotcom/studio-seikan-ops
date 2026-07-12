"use client";

// Vista tabla: columnas clave, orden por columna y filtros simples por etapa y
// ciudad. Marca visualmente los prospectos estancados con borde/etiqueta roja.
import { useMemo, useState } from "react";
import type { Prospecto } from "@/lib/types";
import { ETAPAS, ordenEtapa } from "@/lib/etapas";
import { labelCanal } from "@/lib/canales";
import { formatFecha } from "@/lib/utils";
import { EtapaBadge, EstancadoBadge, ScorePrioridad } from "@/components/ui/Badges";

type SortKey =
  | "nombre_despacho"
  | "ciudad"
  | "canal_origen"
  | "etapa"
  | "fecha_proximo_seguimiento"
  | "score_prioridad";

export function TablaProspectos({
  prospectos,
  estancadoDe,
  onAbrir,
}: {
  prospectos: Prospecto[];
  estancadoDe: (p: Prospecto) => boolean;
  onAbrir: (p: Prospecto) => void;
}) {
  const [filtroEtapa, setFiltroEtapa] = useState("");
  const [filtroCiudad, setFiltroCiudad] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("nombre_despacho");
  const [asc, setAsc] = useState(true);

  const ciudades = useMemo(
    () => Array.from(new Set(prospectos.map((p) => p.ciudad))).sort(),
    [prospectos],
  );

  const filtradas = useMemo(() => {
    let list = prospectos;
    if (filtroEtapa) list = list.filter((p) => p.etapa === filtroEtapa);
    if (filtroCiudad) list = list.filter((p) => p.ciudad === filtroCiudad);

    const factor = asc ? 1 : -1;
    return [...list].sort((a, b) => {
      let va: string | number;
      let vb: string | number;
      if (sortKey === "etapa") {
        va = ordenEtapa(a.etapa);
        vb = ordenEtapa(b.etapa);
      } else if (sortKey === "score_prioridad") {
        va = a.score_prioridad ?? -1;
        vb = b.score_prioridad ?? -1;
      } else if (sortKey === "fecha_proximo_seguimiento") {
        va = a.fecha_proximo_seguimiento
          ? new Date(a.fecha_proximo_seguimiento).getTime()
          : Number.MAX_SAFE_INTEGER;
        vb = b.fecha_proximo_seguimiento
          ? new Date(b.fecha_proximo_seguimiento).getTime()
          : Number.MAX_SAFE_INTEGER;
      } else {
        va = (a[sortKey] ?? "").toString().toLowerCase();
        vb = (b[sortKey] ?? "").toString().toLowerCase();
      }
      if (va < vb) return -1 * factor;
      if (va > vb) return 1 * factor;
      return 0;
    });
  }, [prospectos, filtroEtapa, filtroCiudad, sortKey, asc]);

  function th(key: SortKey, label: string, extra = "") {
    const activo = sortKey === key;
    return (
      <th
        className={`cursor-pointer select-none px-3 py-2 text-left font-medium ${extra}`}
        onClick={() => {
          if (activo) setAsc((v) => !v);
          else {
            setSortKey(key);
            setAsc(true);
          }
        }}
      >
        <span className={activo ? "text-paper" : ""}>
          {label} {activo ? (asc ? "▲" : "▼") : ""}
        </span>
      </th>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select
          className="field w-auto"
          value={filtroEtapa}
          onChange={(e) => setFiltroEtapa(e.target.value)}
        >
          <option value="">Todas las etapas</option>
          {ETAPAS.map((et) => (
            <option key={et.slug} value={et.slug}>
              {et.label}
            </option>
          ))}
        </select>
        <select
          className="field w-auto"
          value={filtroCiudad}
          onChange={(e) => setFiltroCiudad(e.target.value)}
        >
          <option value="">Todas las ciudades</option>
          {ciudades.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {(filtroEtapa || filtroCiudad) && (
          <button
            className="btn btn-ghost text-xs"
            onClick={() => {
              setFiltroEtapa("");
              setFiltroCiudad("");
            }}
          >
            Limpiar
          </button>
        )}
        <span className="label-field ml-auto self-center">
          {filtradas.length} prospecto{filtradas.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="card overflow-x-auto scroll-thin">
        <table className="w-full text-sm">
          <thead className="label-field border-b border-[var(--border)]">
            <tr>
              {th("nombre_despacho", "Despacho")}
              <th className="px-3 py-2 text-left font-medium">Contacto</th>
              {th("ciudad", "Ciudad")}
              {th("canal_origen", "Canal")}
              {th("etapa", "Etapa")}
              {th("fecha_proximo_seguimiento", "Próx. seguimiento")}
              {th("score_prioridad", "Score")}
            </tr>
          </thead>
          <tbody>
            {filtradas.map((p) => {
              const estancado = estancadoDe(p);
              return (
                <tr
                  key={p.id}
                  onClick={() => onAbrir(p)}
                  className="cursor-pointer border-b border-[var(--border)] last:border-0 hover:bg-[rgba(255,255,255,0.03)]"
                  style={
                    estancado
                      ? { boxShadow: "inset 3px 0 0 var(--stamp)" }
                      : undefined
                  }
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-paper">{p.nombre_despacho}</span>
                      {estancado && <EstancadoBadge />}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-muted">{p.nombre_contacto}</td>
                  <td className="px-3 py-2 text-muted">{p.ciudad}</td>
                  <td className="px-3 py-2 text-muted">
                    {labelCanal(p.canal_origen)}
                  </td>
                  <td className="px-3 py-2">
                    <EtapaBadge slug={p.etapa} />
                  </td>
                  <td className="mono px-3 py-2 text-muted">
                    {formatFecha(p.fecha_proximo_seguimiento)}
                  </td>
                  <td className="px-3 py-2">
                    <ScorePrioridad score={p.score_prioridad} />
                  </td>
                </tr>
              );
            })}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted">
                  Sin prospectos que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
