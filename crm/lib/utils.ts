// Utilidades de negocio compartidas.
import type { Prospecto, NotaProspecto } from "./types";

// Formatea una fecha ISO a formato corto es-MX (dd/mm/aaaa).
export function formatFecha(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatFechaHora(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const MS_POR_DIA = 1000 * 60 * 60 * 24;

// Regla "Estancado": 14+ días sin actualización.
// Se usa el máximo entre updated_at del prospecto y el created_at de su última nota.
// Se excluyen cliente_firmado y descartado.
export function estaEstancado(
  prospecto: Prospecto,
  ultimaNotaCreatedAt?: string | null,
): boolean {
  if (prospecto.etapa === "cliente_firmado" || prospecto.etapa === "descartado") {
    return false;
  }
  const candidatos: number[] = [];
  const upd = prospecto.updated_at ?? prospecto.created_at;
  if (upd) candidatos.push(new Date(upd).getTime());
  if (ultimaNotaCreatedAt) candidatos.push(new Date(ultimaNotaCreatedAt).getTime());
  if (candidatos.length === 0) return false;
  const ultimaActividad = Math.max(...candidatos);
  const dias = (Date.now() - ultimaActividad) / MS_POR_DIA;
  return dias >= 14;
}

// Devuelve el created_at de la nota más reciente de un prospecto, o null.
export function ultimaNotaCreatedAt(notas: NotaProspecto[]): string | null {
  if (!notas || notas.length === 0) return null;
  return notas.reduce((max, n) =>
    new Date(n.created_at).getTime() > new Date(max.created_at).getTime() ? n : max,
  ).created_at;
}

// ¿La fecha de próximo seguimiento es hoy o antes? (para "Seguimientos de hoy").
export function seguimientoVencido(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const fin = new Date();
  fin.setHours(23, 59, 59, 999);
  return new Date(iso).getTime() <= fin.getTime();
}
