"use client";

// Detalle de prospecto (drawer lateral): todos los campos editables +
// log de notas (append-only) + historial de etapas + seguimientos.
import { useState } from "react";
import type { Prospecto } from "@/lib/types";
import {
  useNotas,
  useSeguimientos,
  useHistorial,
  useActualizarProspecto,
  useCrearNota,
  useCompletarSeguimiento,
  useCrearSeguimientoManual,
} from "@/hooks/useProspectos";
import { ETAPAS, labelEtapa } from "@/lib/etapas";
import { CANALES } from "@/lib/canales";
import {
  ANGULOS,
  ESPECIALIDADES,
  MOTIVOS_DESCARTE,
} from "@/lib/opciones";
import { formatFecha, formatFechaHora } from "@/lib/utils";
import { EtapaBadge } from "@/components/ui/Badges";

function fechaMasDias(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function ProspectoDrawer({
  prospecto,
  onClose,
}: {
  prospecto: Prospecto;
  onClose: () => void;
}) {
  const id = prospecto.id;
  const notas = useNotas(id);
  const seguimientos = useSeguimientos(id);
  const historial = useHistorial(id);
  const actualizar = useActualizarProspecto();
  const crearNota = useCrearNota();
  const completar = useCompletarSeguimiento();
  const crearManual = useCrearSeguimientoManual();

  const [form, setForm] = useState<Prospecto>(prospecto);
  const [nuevaNota, setNuevaNota] = useState("");
  const [fechaManual, setFechaManual] = useState(fechaMasDias(7));
  const [guardado, setGuardado] = useState(false);

  // Al abrir otro prospecto (cambia el id), reinicia el formulario con sus datos.
  // Patrón recomendado de ajuste de estado en render (evita un useEffect que
  // pisaría ediciones sin guardar en cada refetch del mismo prospecto).
  const [prevId, setPrevId] = useState(prospecto.id);
  if (prevId !== prospecto.id) {
    setPrevId(prospecto.id);
    setForm(prospecto);
  }

  function set<K extends keyof Prospecto>(k: K, v: Prospecto[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setGuardado(false);
  }

  function toggleEspecialidad(e: string) {
    const cur = form.especialidad_migratoria ?? [];
    set(
      "especialidad_migratoria",
      cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e],
    );
  }

  async function guardar() {
    const patch: Partial<Prospecto> = {
      nombre_despacho: form.nombre_despacho,
      nombre_contacto: form.nombre_contacto,
      ciudad: form.ciudad,
      canal_origen: form.canal_origen,
      telefono: form.telefono || null,
      email: form.email || null,
      linkedin_url: form.linkedin_url || null,
      fuente_calificacion: form.fuente_calificacion || null,
      especialidad_migratoria: form.especialidad_migratoria?.length
        ? form.especialidad_migratoria
        : null,
      angulo_mensaje: form.angulo_mensaje || null,
      score_prioridad: form.score_prioridad ?? null,
      etapa: form.etapa,
      // La DB exige motivo cuando la etapa es 'descartado'.
      motivo_descarte:
        form.etapa === "descartado" ? form.motivo_descarte || "otro" : null,
    };
    await actualizar.mutateAsync({ id, patch });
    setGuardado(true);
  }

  async function agregarNota() {
    if (!nuevaNota.trim()) return;
    await crearNota.mutateAsync({ prospecto_id: id, contenido: nuevaNota.trim() });
    setNuevaNota("");
  }

  async function agendarManual() {
    const rows = seguimientos.data ?? [];
    const maxNum = rows.reduce((m, s) => Math.max(m, s.numero), 0);
    await crearManual.mutateAsync({
      prospecto_id: id,
      numero: Math.max(maxNum + 1, 4),
      fecha_programada: new Date(fechaManual).toISOString(),
    });
  }

  return (
    <div className="overlay flex justify-end" onMouseDown={onClose}>
      <aside
        className="h-full w-full max-w-xl overflow-y-auto scroll-thin border-l border-[var(--border)] bg-ink p-5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg text-paper">{prospecto.nombre_despacho}</h2>
            <div className="mt-1 flex items-center gap-2">
              <EtapaBadge slug={prospecto.etapa} />
              <span className="label-field">
                Alta {formatFecha(prospecto.created_at)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-xl leading-none text-muted hover:text-paper"
          >
            &times;
          </button>
        </div>

        {/* --- Datos editables --- */}
        <section className="mb-6">
          <h3 className="label-field mb-2">Datos</h3>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Despacho">
              <input
                className="field"
                value={form.nombre_despacho}
                onChange={(e) => set("nombre_despacho", e.target.value)}
              />
            </Campo>
            <Campo label="Contacto">
              <input
                className="field"
                value={form.nombre_contacto}
                onChange={(e) => set("nombre_contacto", e.target.value)}
              />
            </Campo>
            <Campo label="Ciudad">
              <input
                className="field"
                value={form.ciudad}
                onChange={(e) => set("ciudad", e.target.value)}
              />
            </Campo>
            <Campo label="Canal">
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
            </Campo>
            <Campo label="Etapa">
              <select
                className="field"
                value={form.etapa}
                onChange={(e) =>
                  set("etapa", e.target.value as Prospecto["etapa"])
                }
              >
                {ETAPAS.map((et) => (
                  <option key={et.slug} value={et.slug}>
                    {et.label}
                  </option>
                ))}
              </select>
            </Campo>
            {form.etapa === "descartado" && (
              <Campo label="Motivo descarte *">
                <select
                  className="field"
                  value={form.motivo_descarte ?? "no_responde"}
                  onChange={(e) => set("motivo_descarte", e.target.value)}
                >
                  {MOTIVOS_DESCARTE.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Campo>
            )}
            <Campo label="Teléfono / WhatsApp">
              <input
                className="field"
                value={form.telefono ?? ""}
                onChange={(e) => set("telefono", e.target.value)}
              />
            </Campo>
            <Campo label="Email">
              <input
                className="field"
                value={form.email ?? ""}
                onChange={(e) => set("email", e.target.value)}
              />
            </Campo>
            <Campo label="LinkedIn / redes">
              <input
                className="field"
                value={form.linkedin_url ?? ""}
                onChange={(e) => set("linkedin_url", e.target.value)}
              />
            </Campo>
            <Campo label="Ángulo de mensaje">
              <select
                className="field"
                value={form.angulo_mensaje ?? ""}
                onChange={(e) => set("angulo_mensaje", e.target.value || null)}
              >
                <option value="">—</option>
                {ANGULOS.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Prioridad (1-5)">
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
            </Campo>
          </div>

          <Campo label="Fuente de calificación" className="mt-3">
            <input
              className="field"
              value={form.fuente_calificacion ?? ""}
              onChange={(e) => set("fuente_calificacion", e.target.value)}
            />
          </Campo>

          <div className="mt-3">
            <span className="label-field mb-1 block">Especialidad migratoria</span>
            <div className="flex flex-wrap gap-1.5">
              {ESPECIALIDADES.map((e) => {
                const on = (form.especialidad_migratoria ?? []).includes(e);
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

          <div className="mt-3 flex items-center gap-3 label-field">
            <span>1er contacto: {formatFecha(prospecto.fecha_primer_contacto)}</span>
            <span>·</span>
            <span>
              Próx. seguimiento:{" "}
              {formatFecha(prospecto.fecha_proximo_seguimiento)}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={guardar}
              disabled={actualizar.isPending}
            >
              {actualizar.isPending ? "Guardando…" : "Guardar cambios"}
            </button>
            {guardado && (
              <span className="text-xs text-jade">Cambios guardados.</span>
            )}
          </div>
        </section>

        {/* --- Seguimientos --- */}
        <section className="mb-6">
          <h3 className="label-field mb-2">Seguimientos</h3>
          <div className="flex flex-col gap-2">
            {(seguimientos.data ?? []).map((s) => (
              <div
                key={s.id}
                className="card flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="text-paper">
                  #{s.numero}{" "}
                  <span className="text-muted">
                    · {formatFecha(s.fecha_programada)}
                    {s.numero > 3 ? " · manual" : ""}
                  </span>
                </span>
                {s.completado ? (
                  <span className="text-xs text-jade">
                    Completado {formatFecha(s.completado_at)}
                  </span>
                ) : (
                  <button
                    className="btn btn-jade text-xs"
                    onClick={() => completar.mutate(s.id)}
                    disabled={completar.isPending}
                  >
                    Completar
                  </button>
                )}
              </div>
            ))}
            {(seguimientos.data ?? []).length === 0 && (
              <p className="text-xs text-muted">
                Sin seguimientos. Se generan solos (+3/+7/+14 días) al pasar a
                &quot;Contactado&quot;.
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="date"
              className="field w-auto"
              value={fechaManual}
              onChange={(e) => setFechaManual(e.target.value)}
            />
            <button
              className="btn btn-ghost text-xs"
              onClick={agendarManual}
              disabled={crearManual.isPending}
            >
              Agendar seguimiento manual
            </button>
          </div>
        </section>

        {/* --- Notas (append-only) --- */}
        <section className="mb-6">
          <h3 className="label-field mb-2">Notas</h3>
          <div className="flex flex-col gap-2">
            {(notas.data ?? []).map((n) => (
              <div key={n.id} className="card px-3 py-2 text-sm">
                <div className="label-field mb-0.5">
                  {formatFechaHora(n.created_at)}
                </div>
                <div className="whitespace-pre-wrap text-paper">
                  {n.contenido}
                </div>
              </div>
            ))}
            {(notas.data ?? []).length === 0 && (
              <p className="text-xs text-muted">Sin notas todavía.</p>
            )}
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              className="field"
              rows={2}
              placeholder="Agregar nota…"
              value={nuevaNota}
              onChange={(e) => setNuevaNota(e.target.value)}
            />
            <button
              className="btn btn-ghost self-end text-xs"
              onClick={agregarNota}
              disabled={crearNota.isPending || !nuevaNota.trim()}
            >
              Agregar nota
            </button>
          </div>
        </section>

        {/* --- Historial de etapas --- */}
        <section>
          <h3 className="label-field mb-2">Historial de etapas</h3>
          <ol className="flex flex-col gap-1.5">
            {(historial.data ?? []).map((h) => (
              <li key={h.id} className="flex items-center gap-2 text-sm">
                <span className="mono text-xs text-muted">
                  {formatFechaHora(h.created_at)}
                </span>
                <span className="text-muted">→</span>
                <EtapaBadge slug={h.etapa} />
                {h.etapa_anterior && (
                  <span className="text-xs text-muted-dark">
                    (desde {labelEtapa(h.etapa_anterior)})
                  </span>
                )}
              </li>
            ))}
            {(historial.data ?? []).length === 0 && (
              <p className="text-xs text-muted">Sin cambios de etapa aún.</p>
            )}
          </ol>
        </section>
      </aside>
    </div>
  );
}

function Campo({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label-field mb-1 block">{label}</label>
      {children}
    </div>
  );
}
