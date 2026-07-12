"use client";

// Hooks de acceso a datos de prospectos vía Supabase + TanStack Query.
// La DB ya tiene triggers: al pasar a 'contactado' fija fecha_primer_contacto
// y crea los 3 seguimientos; sincroniza fecha_proximo_seguimiento; registra
// historial_etapas; actualiza updated_at. El frontend NO duplica esa lógica.

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  Prospecto,
  NotaProspecto,
  Seguimiento,
  HistorialEtapa,
  NuevoProspecto,
} from "@/lib/types";
import type { EtapaSlug } from "@/lib/etapas";

const supabase = () => createClient();

export const prospectosKey = ["prospectos"] as const;

// Lista completa de prospectos (volumen bajo, un solo usuario).
export function useProspectos() {
  return useQuery({
    queryKey: prospectosKey,
    queryFn: async (): Promise<Prospecto[]> => {
      const { data, error } = await supabase()
        .from("prospectos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Prospecto[];
    },
  });
}

// Notas del prospecto (cronológico, nunca se editan/borran).
export function useNotas(prospectoId: string | null) {
  return useQuery({
    queryKey: ["notas", prospectoId],
    enabled: !!prospectoId,
    queryFn: async (): Promise<NotaProspecto[]> => {
      const { data, error } = await supabase()
        .from("notas_prospecto")
        .select("*")
        .eq("prospecto_id", prospectoId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as NotaProspecto[];
    },
  });
}

// Todas las notas (para calcular "estancado" en las vistas de lista/kanban).
export function useTodasNotas() {
  return useQuery({
    queryKey: ["notas", "todas"],
    queryFn: async (): Promise<NotaProspecto[]> => {
      const { data, error } = await supabase()
        .from("notas_prospecto")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as NotaProspecto[];
    },
  });
}

// Todos los seguimientos pendientes (para la tarjeta "Seguimientos de hoy" del
// dashboard). Permite ubicar, por prospecto, el seguimiento pendiente de menor
// número — el que toca completar — y saber si es el nº3 (+14 días).
export function useSeguimientosPendientes() {
  return useQuery({
    queryKey: ["seguimientos", "pendientes"],
    queryFn: async (): Promise<Seguimiento[]> => {
      const { data, error } = await supabase()
        .from("seguimientos")
        .select("*")
        .eq("completado", false)
        .order("numero", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Seguimiento[];
    },
  });
}

export function useSeguimientos(prospectoId: string | null) {
  return useQuery({
    queryKey: ["seguimientos", prospectoId],
    enabled: !!prospectoId,
    queryFn: async (): Promise<Seguimiento[]> => {
      const { data, error } = await supabase()
        .from("seguimientos")
        .select("*")
        .eq("prospecto_id", prospectoId)
        .order("numero", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Seguimiento[];
    },
  });
}

export function useHistorial(prospectoId: string | null) {
  return useQuery({
    queryKey: ["historial", prospectoId],
    enabled: !!prospectoId,
    queryFn: async (): Promise<HistorialEtapa[]> => {
      const { data, error } = await supabase()
        .from("historial_etapas")
        .select("*")
        .eq("prospecto_id", prospectoId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as HistorialEtapa[];
    },
  });
}

// Todo el historial de etapas (para tasa de respuesta por canal en el dashboard).
export function useTodoHistorial() {
  return useQuery({
    queryKey: ["historial", "todo"],
    queryFn: async (): Promise<HistorialEtapa[]> => {
      const { data, error } = await supabase()
        .from("historial_etapas")
        .select("*");
      if (error) throw error;
      return (data ?? []) as HistorialEtapa[];
    },
  });
}

// Alta de prospecto.
export function useCrearProspecto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nuevo: NuevoProspecto): Promise<Prospecto> => {
      const { data, error } = await supabase()
        .from("prospectos")
        .insert(nuevo)
        .select()
        .single();
      if (error) throw error;
      return data as Prospecto;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: prospectosKey });
    },
  });
}

export interface CambiarEtapaInput {
  id: string;
  etapa: EtapaSlug;
  // Obligatorio cuando etapa === 'descartado' (CHECK de la DB).
  motivo_descarte?: string | null;
}

// Mover de etapa: un simple UPDATE dispara los triggers de la DB.
export function useCambiarEtapa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, etapa, motivo_descarte }: CambiarEtapaInput) => {
      const patch: Record<string, unknown> = { etapa };
      if (etapa === "descartado") {
        patch.motivo_descarte = motivo_descarte ?? null;
      }
      const { error } = await supabase()
        .from("prospectos")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    // Update optimista para el kanban.
    onMutate: async ({ id, etapa, motivo_descarte }) => {
      await qc.cancelQueries({ queryKey: prospectosKey });
      const prev = qc.getQueryData<Prospecto[]>(prospectosKey);
      qc.setQueryData<Prospecto[]>(prospectosKey, (old) =>
        (old ?? []).map((p) =>
          p.id === id
            ? {
                ...p,
                etapa,
                motivo_descarte:
                  etapa === "descartado" ? motivo_descarte ?? null : p.motivo_descarte,
              }
            : p,
        ),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(prospectosKey, ctx.prev);
    },
    onSettled: (_d, _e, vars) => {
      qc.invalidateQueries({ queryKey: prospectosKey });
      qc.invalidateQueries({ queryKey: ["historial", vars.id] });
      qc.invalidateQueries({ queryKey: ["historial", "todo"] });
      qc.invalidateQueries({ queryKey: ["seguimientos"] });
    },
  });
}

// Edición general de campos del prospecto.
export function useActualizarProspecto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Prospecto>;
    }) => {
      const { error } = await supabase()
        .from("prospectos")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: prospectosKey });
    },
  });
}

// Agregar nota (append-only).
export function useCrearNota() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      prospecto_id,
      contenido,
    }: {
      prospecto_id: string;
      contenido: string;
    }) => {
      const { error } = await supabase()
        .from("notas_prospecto")
        .insert({ prospecto_id, contenido });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["notas", vars.prospecto_id] });
      qc.invalidateQueries({ queryKey: ["notas", "todas"] });
    },
  });
}

// Marcar un seguimiento como completado.
export function useCompletarSeguimiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (seguimientoId: string) => {
      const { error } = await supabase()
        .from("seguimientos")
        .update({ completado: true, completado_at: new Date().toISOString() })
        .eq("id", seguimientoId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: prospectosKey });
      qc.invalidateQueries({ queryKey: ["seguimientos"] });
    },
  });
}

// Crear un seguimiento manual (numero > 3), fecha libre.
export function useCrearSeguimientoManual() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      prospecto_id,
      numero,
      fecha_programada,
    }: {
      prospecto_id: string;
      numero: number;
      fecha_programada: string;
    }) => {
      const { error } = await supabase()
        .from("seguimientos")
        .insert({ prospecto_id, numero, fecha_programada });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: prospectosKey });
      qc.invalidateQueries({ queryKey: ["seguimientos"] });
    },
  });
}
