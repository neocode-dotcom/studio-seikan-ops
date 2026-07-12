// Fuente de verdad ÚNICA del embudo de prospección.
// Las 8 etapas deben ser idénticas, palabra por palabra, a las de
// docs/04-ventas-y-prospeccion.md (sección 4) y docs/03-crm-interno.md.
// Si cambia el embudo, cambia en ambos documentos Y aquí a la vez.

export type EtapaSlug =
  | "identificado"
  | "contactado"
  | "respondio"
  | "auditoria_agendada"
  | "auditoria_realizada"
  | "propuesta_enviada"
  | "cliente_firmado"
  | "descartado";

export interface Etapa {
  slug: EtapaSlug;
  label: string;
  // Orden 1-8 del embudo. Se usa para calcular métricas
  // (contactado = orden >= 2, respondió = orden >= 3).
  orden: number;
  // Colores derivados de la paleta de marca (docs/01).
  color: string; // acento/borde de la columna
  bg: string; // fondo suave de la columna
}

export const ETAPAS: Etapa[] = [
  {
    slug: "identificado",
    label: "Identificado",
    orden: 1,
    color: "#5C6A72",
    bg: "rgba(92,106,114,0.10)",
  },
  {
    slug: "contactado",
    label: "Contactado",
    orden: 2,
    color: "#93A0A8",
    bg: "rgba(147,160,168,0.12)",
  },
  {
    slug: "respondio",
    label: "Respondió",
    orden: 3,
    color: "#3E6E5E",
    bg: "rgba(62,110,94,0.12)",
  },
  {
    slug: "auditoria_agendada",
    label: "Auditoría agendada",
    orden: 4,
    color: "#4A7A9E",
    bg: "rgba(74,122,158,0.12)",
  },
  {
    slug: "auditoria_realizada",
    label: "Auditoría realizada",
    orden: 5,
    color: "#5A8FB0",
    bg: "rgba(90,143,176,0.12)",
  },
  {
    slug: "propuesta_enviada",
    label: "Propuesta enviada",
    orden: 6,
    color: "#C2534A",
    bg: "rgba(194,83,74,0.10)",
  },
  {
    slug: "cliente_firmado",
    label: "Cliente firmado",
    orden: 7,
    color: "#3E6E5E",
    bg: "rgba(62,110,94,0.18)",
  },
  {
    slug: "descartado",
    label: "Descartado",
    orden: 8,
    color: "#A6362A",
    bg: "rgba(166,54,42,0.10)",
  },
];

export const ETAPAS_SLUGS: EtapaSlug[] = ETAPAS.map((e) => e.slug);

const ETAPA_MAP = new Map<EtapaSlug, Etapa>(ETAPAS.map((e) => [e.slug, e]));

export function getEtapa(slug: string): Etapa | undefined {
  return ETAPA_MAP.get(slug as EtapaSlug);
}

export function labelEtapa(slug: string): string {
  return getEtapa(slug)?.label ?? slug;
}

export function ordenEtapa(slug: string): number {
  return getEtapa(slug)?.orden ?? 0;
}
