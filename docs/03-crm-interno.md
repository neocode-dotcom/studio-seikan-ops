# 03 — CRM Interno de Prospección

## Estado actual

**Jul 2026 — MVP construido.** Código en `crm/` (Next.js 16 App Router + TypeScript + Tailwind 4 + Supabase SSR + TanStack Query + dnd-kit). Deploy previsto: proyecto Vercel aparte con Root Directory = `crm`. `npm run build` y `npm run lint` pasan limpios.

Construido:
- **Auth** de un solo usuario: `/login` (email + password), `proxy.ts` (convención Next 16, antes `middleware`) protege todo excepto `/login`, botón de cerrar sesión en el shell. Sin registro (usuario creado a mano en Supabase).
- **Módulo 1 completo** (`/prospectos`): vista kanban con las 8 columnas y drag-and-drop + vista tabla (orden por columnas, filtro por etapa y ciudad), toggle sin recargar. Alta de prospecto vía modal (<30 s, solo 4 obligatorios). Detalle en drawer con todos los campos editables + log de notas append-only + historial de etapas + seguimientos. Drop en "Descartado" abre modal obligatorio de motivo (cancelar no mueve la tarjeta). Badge "Estancado" (14+ días sin actualización, máximo entre `updated_at` y última nota; excluye cliente_firmado y descartado) en kanban y tabla.
- **Módulo 4, puntos 1-3** (`/` dashboard): "Seguimientos de hoy" (lista accionable con diálogo de completar; en el 3er seguimiento la acción principal es "Descartar (no responde)"), embudo visual por etapa, tasa de respuesta por canal (calculada en JS desde `historial_etapas` + `prospectos`).
- **Reglas de seguimiento 3/7/14 días:** implementadas vía **triggers de la base de datos** (al pasar a "Contactado" se fija `fecha_primer_contacto` y se crean los 3 seguimientos; `fecha_proximo_seguimiento` e `historial_etapas` se sincronizan solos). El frontend no duplica esa lógica.

Fuente de verdad del embudo: `crm/lib/etapas.ts` (8 etapas idénticas a `docs/04` sección 4). Canales: `crm/lib/canales.ts` (11 canales de `docs/04` sección 2).

Pendiente (no MVP): Módulos 2, 3, 5 y puntos 4-7 del Módulo 4 — ver "Prioridad de construcción". No construir sin que el MVP esté en uso real / haya volumen de datos.

_Documento originalmente redactado como PRD; mantener esta sección como changelog vivo conforme avance el desarrollo._

**Importante — no confundir con el producto que se vende:** esto es la herramienta interna de José para gestionar su propio pipeline de prospección hacia despachos migratorios. Es distinto del CRM con IA que Studio Seikan vende como parte del paquete a esos despachos como clientes finales. No mezclar código, no mezclar alcance.

---

## 1. Quién lo usa
Un solo usuario (José). No multi-tenant. Autenticación simple de un solo usuario vía Supabase Auth es suficiente — sin roles ni permisos.

## 2. Objetivo — 5 preguntas que el sistema debe responder en menos de 10 segundos
1. ¿Cuántos prospectos tengo y en qué etapa está cada uno?
2. ¿Qué canal tiene mejor tasa de respuesta?
3. ¿Cuántas auditorías gratuitas tengo agendadas esta semana?
4. ¿A quién le toca seguimiento hoy?
5. ¿Cuál es mi conversión real de prospecto → auditoría → cliente firmado?

---

## 3. Módulos funcionales

### Módulo 1 — Gestión de Prospectos (núcleo del sistema)

Campos del registro de prospecto:

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| Nombre del despacho | texto | Sí | |
| Nombre del contacto | texto | Sí | |
| Ciudad | texto | Sí | Prioridad: CDMX, Tijuana, Guadalajara |
| Canal de origen | selección única | Sí | Ver lista de 11 canales en `04-ventas-y-prospeccion.md` |
| Teléfono/WhatsApp | texto | No | |
| Email | texto | No | |
| LinkedIn/redes | texto (URL) | No | |
| Fuente de calificación | texto libre | No | Por qué se calificó — ej. reseña negativa sobre respuesta |
| Especialidad migratoria | selección múltiple | No | Visa de trabajo, Residencia temporal, Residencia permanente, Asilo/refugio, Naturalización, Reunificación familiar, General |
| Etapa del embudo | selección única | Sí | Ver 8 etapas abajo — campo más importante del sistema |
| Ángulo de mensaje usado | selección única | No | Abandono / Transparencia / Confianza |
| Fecha de primer contacto | fecha | Se llena automático al pasar a "Contactado" | |
| Fecha de próximo seguimiento | fecha | Calculada automáticamente | Ver reglas abajo |
| Notas | texto largo tipo log | No | Histórico cronológico, nunca se sobrescribe |
| Score de prioridad | 1-5 | No | Manual |

**Las 8 etapas del embudo (lista fija, no editable en el MVP):**
1. Identificado
2. Contactado
3. Respondió
4. Auditoría agendada
5. Auditoría realizada
6. Propuesta enviada
7. Cliente firmado
8. Descartado (requiere motivo: no responde / no calificó / presupuesto / no es buen fit / otro)

Vista dual obligatoria: kanban (drag-and-drop entre las 8 columnas) + tabla/lista. Intercambiables sin recargar.

**Reglas de seguimiento automático:**
- Al mover a "Contactado" → calcular y guardar automáticamente 3 fechas sugeridas: +3, +7, +14 días
- Dashboard muestra "Seguimientos de hoy": todo prospecto con fecha de seguimiento ≤ hoy, excluyendo "Cliente firmado" y "Descartado"
- Al completar un seguimiento → preguntar si se agenda el siguiente automático o si el prospecto avanza de etapa
- Si un prospecto lleva 14+ días sin actualización → resaltar visualmente como "estancado" en todas las vistas

### Módulo 2 — Alianzas B2B (entidad separada — Fase 3 del roadmap)

Para relaciones de referidos cruzados (relocation, inmobiliarias, notarías, academias de idiomas) — no es venta directa, es partnership bidireccional.

| Campo | Tipo |
|---|---|
| Nombre del negocio | texto |
| Tipo de negocio | selección: Relocation / Inmobiliaria / Notaría / Academia de idiomas / Otro |
| Contacto | texto |
| Estado | selección: Contactado / En conversación / Acuerdo activo / Inactivo |
| Referidos enviados (contador) | número |
| Referidos recibidos (contador) | número |
| Notas | texto largo con historial |

### Módulo 3 — Plantillas de mensaje

CRUD de plantillas (nombre, canal, ángulo, cuerpo con variables `{nombre_despacho}` `{nombre_contacto}`). Botón "copiar con variables sustituidas". Al usar una plantilla con un prospecto, registrar automáticamente en sus notas qué plantilla/ángulo se usó y cuándo — esto alimenta las métricas del Módulo 4. Contenido inicial de plantillas: ver `06-plantillas-de-mensajes.md`.

### Módulo 4 — Dashboard de métricas

1. Tarjeta "Seguimientos de hoy" — lista accionable
2. Embudo visual — cantidad por cada una de las 8 etapas
3. Tasa de respuesta por canal — tabla: Canal | Contactados | Respondieron | % respuesta
4. Tasa de respuesta por ángulo de mensaje — misma lógica, agrupado por Abandono/Transparencia/Confianza
5. Conversión del embudo completo — % entre cada paso consecutivo
6. Actividad de la semana — prospectos agregados / contactos realizados / auditorías agendadas
7. Filtro de fecha global (semana / mes / todo / rango personalizado)

### Módulo 5 — Calendario de auditorías

Vista semana/mes mostrando solo "Auditoría agendada". Click abre detalle. Marcar "realizada" mueve automáticamente la etapa. Opcional: sync con Google Calendar (no MVP).

---

## 4. Modelo de datos (Supabase / PostgreSQL)

```sql
-- prospectos
id uuid PK
nombre_despacho text not null
nombre_contacto text not null
ciudad text not null
canal_origen text not null
telefono text
email text
linkedin_url text
fuente_calificacion text
especialidad_migratoria text[]
etapa text not null default 'identificado'
angulo_mensaje text
fecha_primer_contacto timestamp
fecha_proximo_seguimiento timestamp
score_prioridad integer
motivo_descarte text
created_at timestamp default now()
updated_at timestamp

-- notas_prospecto
id uuid PK
prospecto_id uuid FK -> prospectos.id
contenido text not null
created_at timestamp default now()

-- alianzas
id uuid PK
nombre_negocio text not null
tipo_negocio text not null
contacto text
estado text not null default 'contactado'
referidos_enviados integer default 0
referidos_recibidos integer default 0
created_at timestamp default now()

-- notas_alianza (misma estructura que notas_prospecto, FK -> alianzas.id)

-- plantillas_mensaje
id uuid PK
nombre text not null
canal text not null
angulo text not null
cuerpo text not null
created_at timestamp default now()

-- envios_mensaje
id uuid PK
prospecto_id uuid FK -> prospectos.id
plantilla_id uuid FK -> plantillas_mensaje.id (nullable)
canal text not null
angulo text not null
fecha_envio timestamp default now()
obtuvo_respuesta boolean default false

-- auditorias
id uuid PK
prospecto_id uuid FK -> prospectos.id not null
fecha_hora timestamp not null
realizada boolean default false
notas_resultado text
created_at timestamp default now()
```

---

## 5. Requisitos no funcionales

| Categoría | Requisito |
|---|---|
| Backend | Node.js |
| Base de datos | Supabase (PostgreSQL) |
| Frontend | Next.js |
| Auth | Un solo usuario, Supabase Auth simple |
| Hosting | Vercel (frontend) + Supabase (DB) — sin VPS, bajo tráfico |
| Responsive | Prioridad desktop, mobile usable pero no requiere pulido extremo |
| Idioma | Español en toda la interfaz |
| Exportación | Botón de exportar tabla de prospectos a CSV |

---

## 6. Prioridad de construcción

**MVP (primero):**
- Módulo 1 completo (CRUD + kanban + lista)
- Módulo 4, solo puntos 1, 2, 3
- Reglas de seguimiento automático

**Versión 2 (cuando el MVP esté en uso real):**
- Módulo 3 (plantillas)
- Módulo 4 completo (puntos 4-7)
- Módulo 5 (calendario)

**Versión 3 (con volumen y alianzas activas):**
- Módulo 2 (alianzas B2B)
- Exportación CSV
- Posible IA: resumen automático de notas, sugerencia de próxima acción — **no construir sin datos reales previos**, sería adivinar en lugar de optimizar

---

## 7. Criterios de aceptación del MVP

El MVP está terminado cuando José puede, sin ninguna hoja de cálculo externa:
1. Agregar un prospecto en menos de 30 segundos
2. Ver de un vistazo cuántos prospectos hay en cada etapa
3. Ver cada mañana a quién debe darle seguimiento ese día
4. Mover un prospecto de etapa arrastrándolo en kanban
5. Ver, con 20+ prospectos contactados en 2+ canales, cuál canal responde mejor

---

## 8. Fuera de alcance explícito (no construir sin pedido directo)

- Envío automático de mensajes (WhatsApp/email) desde el sistema — en el MVP se copia la plantilla y se envía manualmente
- Scraping automático de Google Maps/LinkedIn — carga manual
- Facturación, cotizaciones, contratos
- Multi-usuario/permisos de equipo
- Notificaciones push/email de seguimientos pendientes — el usuario revisa el dashboard activamente