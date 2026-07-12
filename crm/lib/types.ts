// Tipos que reflejan el esquema real de la DB (schema public, nombres en español).
// La DB ya existe y NO se modifica desde el frontend.

import type { EtapaSlug } from "./etapas";

export interface Prospecto {
  id: string;
  nombre_despacho: string;
  nombre_contacto: string;
  ciudad: string;
  canal_origen: string;
  telefono: string | null;
  email: string | null;
  linkedin_url: string | null;
  fuente_calificacion: string | null;
  especialidad_migratoria: string[] | null;
  etapa: EtapaSlug;
  angulo_mensaje: string | null;
  fecha_primer_contacto: string | null;
  fecha_proximo_seguimiento: string | null;
  score_prioridad: number | null;
  motivo_descarte: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface NotaProspecto {
  id: string;
  prospecto_id: string;
  contenido: string;
  created_at: string;
}

export interface Seguimiento {
  id: string;
  prospecto_id: string;
  numero: number;
  fecha_programada: string;
  completado: boolean;
  completado_at: string | null;
  created_at: string;
}

export interface HistorialEtapa {
  id: string;
  prospecto_id: string;
  etapa: string;
  etapa_anterior: string | null;
  created_at: string;
}

// Payload para alta de prospecto. Solo los 4 primeros son obligatorios.
export interface NuevoProspecto {
  nombre_despacho: string;
  nombre_contacto: string;
  ciudad: string;
  canal_origen: string;
  telefono?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  fuente_calificacion?: string | null;
  especialidad_migratoria?: string[] | null;
  angulo_mensaje?: string | null;
  score_prioridad?: number | null;
  etapa?: EtapaSlug;
}
