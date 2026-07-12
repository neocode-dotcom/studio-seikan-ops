"use client";

// Alta de prospecto. Solo 4 campos obligatorios (despacho, contacto, ciudad,
// canal) para poder completarse en menos de 30 segundos. El resto es opcional
// y vive en una sección secundaria para no meter fricción.
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useCrearProspecto } from "@/hooks/useProspectos";
import { CANALES } from "@/lib/canales";
import {
  ANGULOS,
  ESPECIALIDADES,
  CIUDADES_SUGERIDAS,
} from "@/lib/opciones";
import type { NuevoProspecto } from "@/lib/types";

const VACIO: NuevoProspecto = {
  nombre_despacho: "",
  nombre_contacto: "",
  ciudad: "",
  canal_origen: CANALES[0].slug,
};

export function NuevoProspectoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const crear = useCrearProspecto();
  const [form, setForm] = useState<NuevoProspecto>(VACIO);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [masDetalles, setMasDetalles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof NuevoProspecto>(k: K, v: NuevoProspecto[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleEspecialidad(e: string) {
    setEspecialidades((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e],
    );
  }

  function reset() {
    setForm(VACIO);
    setEspecialidades([]);
    setMasDetalles(false);
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (
      !form.nombre_despacho.trim() ||
      !form.nombre_contacto.trim() ||
      !form.ciudad.trim() ||
      !form.canal_origen
    ) {
      setError("Faltan campos obligatorios.");
      return;
    }
    try {
      await crear.mutateAsync({
        ...form,
        especialidad_migratoria: especialidades.length ? especialidades : null,
      });
      reset();
      onClose();
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Nuevo prospecto"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div>
          <label className="label-field mb-1 block">Despacho *</label>
          <input
            autoFocus
            className="field"
            value={form.nombre_despacho}
            onChange={(e) => set("nombre_despacho", e.target.value)}
          />
        </div>
        <div>
          <label className="label-field mb-1 block">Contacto *</label>
          <input
            className="field"
            value={form.nombre_contacto}
            onChange={(e) => set("nombre_contacto", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field mb-1 block">Ciudad *</label>
            <input
              list="ciudades-sugeridas"
              className="field"
              value={form.ciudad}
              onChange={(e) => set("ciudad", e.target.value)}
            />
            <datalist id="ciudades-sugeridas">
              {CIUDADES_SUGERIDAS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="label-field mb-1 block">Canal *</label>
            <select
              className="field"
              value={form.canal_origen}
              onChange={(e) => set("canal_origen", e.target.value)}
            >
              {CANALES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMasDetalles((v) => !v)}
          className="label-field self-start hover:text-paper"
        >
          {masDetalles ? "− Menos detalles" : "+ Más detalles (opcional)"}
        </button>

        {masDetalles && (
          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field mb-1 block">Teléfono / WhatsApp</label>
                <input
                  className="field"
                  value={form.telefono ?? ""}
                  onChange={(e) => set("telefono", e.target.value || null)}
                />
              </div>
              <div>
                <label className="label-field mb-1 block">Email</label>
                <input
                  type="email"
                  className="field"
                  value={form.email ?? ""}
                  onChange={(e) => set("email", e.target.value || null)}
                />
              </div>
            </div>
            <div>
              <label className="label-field mb-1 block">LinkedIn / redes (URL)</label>
              <input
                className="field"
                value={form.linkedin_url ?? ""}
                onChange={(e) => set("linkedin_url", e.target.value || null)}
              />
            </div>
            <div>
              <label className="label-field mb-1 block">Fuente de calificación</label>
              <input
                className="field"
                placeholder="Ej. reseña negativa sobre respuesta"
                value={form.fuente_calificacion ?? ""}
                onChange={(e) =>
                  set("fuente_calificacion", e.target.value || null)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field mb-1 block">Ángulo de mensaje</label>
                <select
                  className="field"
                  value={form.angulo_mensaje ?? ""}
                  onChange={(e) =>
                    set("angulo_mensaje", e.target.value || null)
                  }
                >
                  <option value="">—</option>
                  {ANGULOS.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-field mb-1 block">Prioridad (1-5)</label>
                <select
                  className="field"
                  value={form.score_prioridad ?? ""}
                  onChange={(e) =>
                    set(
                      "score_prioridad",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                >
                  <option value="">—</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label-field mb-1 block">Especialidad migratoria</label>
              <div className="flex flex-wrap gap-1.5">
                {ESPECIALIDADES.map((e) => {
                  const on = especialidades.includes(e);
                  return (
                    <button
                      type="button"
                      key={e}
                      onClick={() => toggleEspecialidad(e)}
                      className={`rounded px-2 py-1 text-xs transition-colors ${
                        on
                          ? "bg-[rgba(62,110,94,0.25)] text-paper"
                          : "border border-[var(--border)] text-muted hover:text-paper"
                      }`}
                    >
                      {e}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-stamp-light">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={crear.isPending}
          >
            {crear.isPending ? "Guardando…" : "Guardar prospecto"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
