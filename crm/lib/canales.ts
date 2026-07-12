// Los 11 canales de prospección definidos en docs/04-ventas-y-prospeccion.md
// (sección 2, agrupados por temperatura del lead). Slug para la DB (canal_origen)
// + etiqueta para la UI. El orden respeta el documento: fríos -> tibios -> calientes.

export interface Canal {
  slug: string;
  label: string;
  temperatura: "frio" | "tibio" | "caliente";
}

export const CANALES: Canal[] = [
  // Fríos
  { slug: "google_maps", label: "Google Maps / Google Business", temperatura: "frio" },
  { slug: "directorios_barras", label: "Directorios de colegios/barras", temperatura: "frio" },
  { slug: "email_frio", label: "Email frío", temperatura: "frio" },
  { slug: "linkedin", label: "LinkedIn", temperatura: "frio" },
  { slug: "grupos_facebook", label: "Grupos de Facebook de migrantes/expats", temperatura: "frio" },
  // Tibios
  { slug: "comunidades_expats", label: "Comunidades de expats (contenido propio)", temperatura: "tibio" },
  { slug: "alianzas_b2b", label: "Alianzas B2B", temperatura: "tibio" },
  { slug: "eventos_colegios", label: "Eventos/webinars de colegios de abogados", temperatura: "tibio" },
  { slug: "comentarios_youtube", label: "Comentarios en YouTube", temperatura: "tibio" },
  // Calientes
  { slug: "referidos", label: "Referidos directos", temperatura: "caliente" },
  { slug: "inbound_propio", label: "Inbound propio", temperatura: "caliente" },
];

const CANAL_MAP = new Map<string, Canal>(CANALES.map((c) => [c.slug, c]));

export function labelCanal(slug: string): string {
  return CANAL_MAP.get(slug)?.label ?? slug;
}
