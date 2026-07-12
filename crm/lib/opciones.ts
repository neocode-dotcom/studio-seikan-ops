// Catálogos de opciones fijas para selects del formulario de prospecto.
// Los slugs de ángulo y motivo de descarte coinciden con los CHECK de la DB.

// Ángulo de mensaje (docs/04 sección 5).
export interface OpcionSimple {
  slug: string;
  label: string;
}

export const ANGULOS: OpcionSimple[] = [
  { slug: "abandono", label: "Abandono (dinero perdido)" },
  { slug: "transparencia", label: "Transparencia (ventaja competitiva)" },
  { slug: "confianza", label: "Confianza (reputación / vetting)" },
];

export function labelAngulo(slug: string | null | undefined): string {
  if (!slug) return "—";
  return ANGULOS.find((a) => a.slug === slug)?.label ?? slug;
}

// Motivo de descarte (CHECK de la DB, exige valor cuando etapa='descartado').
export const MOTIVOS_DESCARTE: OpcionSimple[] = [
  { slug: "no_responde", label: "No responde" },
  { slug: "no_califico", label: "No calificó" },
  { slug: "presupuesto", label: "Presupuesto" },
  { slug: "no_es_buen_fit", label: "No es buen fit" },
  { slug: "otro", label: "Otro" },
];

export function labelMotivo(slug: string | null | undefined): string {
  if (!slug) return "—";
  return MOTIVOS_DESCARTE.find((m) => m.slug === slug)?.label ?? slug;
}

// Especialidad migratoria (selección múltiple, docs/03).
export const ESPECIALIDADES: string[] = [
  "Visa de trabajo",
  "Residencia temporal",
  "Residencia permanente",
  "Asilo/refugio",
  "Naturalización",
  "Reunificación familiar",
  "General",
];

// Ciudades sugeridas (prioridad del ICP), pero el campo es texto libre.
export const CIUDADES_SUGERIDAS: string[] = ["CDMX", "Tijuana", "Guadalajara"];
