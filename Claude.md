# CLAUDE.md — Studio Seikan · Operación Interna

Este archivo se lee al inicio de cada sesión. Contiene el contexto que nunca debe perderse entre sesiones. Los detalles profundos de cada área viven en `docs/` — este archivo es el mapa, no el territorio.

---

## 1. Qué es Studio Seikan

Agencia de automatización con IA fundada por José Escobar (estratega digital, freelancer de diseño web). Vende **sistemas de captación de clientes con IA** a despachos de abogados de migración en México: sitio web de alta conversión + Meta Ads con creativos de IA + bot de WhatsApp/webchat para calificación y agendamiento + CRM con IA para gestión de leads.

**Nicho actual:** derecho migratorio (visas, residencia, asilo, naturalización, reunificación familiar), abogados independientes y despachos pequeños en México. Mercado de entrada recomendado: CDMX, Tijuana, Guadalajara.

**Etapa del negocio:** pre-cliente real. Existen MVPs ficticios de portafolio (AURUM Clinic de un nicho anterior descartado, y la propia web de Studio Seikan ya rediseñada para este nicho). Aún no hay caso de éxito real — la prioridad de negocio es conseguir el primer cliente firmado.

**Presupuesto y capacidad:** ~$50 USD de presupuesto líquido, 2-4 horas diarias de José dedicadas a esto. Cualquier recomendación técnica o de gasto debe respetar esta restricción salvo que se indique lo contrario.

---

## 2. Las 3 áreas de responsabilidad de esta sesión de Claude Code

| Área | Qué implica | Doc de referencia obligatoria |
|---|---|---|
| **A. Landing page** | Desarrollo y mantenimiento de studioseikan.com — el sitio de la agencia (no el de clientes) | `docs/02-landing-page.md` |
| **B. CRM interno** | Desarrollo y mantenimiento del CRM de prospección propio de José (herramienta interna, NO el producto que se vende a clientes) | `docs/03-crm-interno.md` |
| **C. Asistente de ventas/prospección** | Generar/ajustar mensajes de outreach, calcular métricas, redactar reportes, apoyar la operación diaria de prospección | `docs/04-ventas-y-prospeccion.md` + `docs/06-plantillas-de-mensajes.md` |

**Regla de carga de contexto:** antes de trabajar en un área, lee el doc correspondiente completo. No asumas que recuerdas los detalles de una sesión anterior — este archivo y `docs/` son la fuente de verdad, no el historial de chat.

---

## 3. Reglas que nunca se rompen (compliance — aplican a las 3 áreas)

Esto es lo más importante de todo el archivo. Studio Seikan vende a abogados, y el error de cumplimiento normativo es el que más rápido destruye la confianza de un despacho legal en la agencia.

1. **Ningún copy —de landing page, anuncio, mensaje de prospección o bot— promete resultados legales.** Prohibido: "ganamos tu caso", "aprobación garantizada", "te resolvemos el trámite". Permitido: lenguaje de proceso y capacidad ("te ayudamos a organizar tu caso", "respuesta en minutos").
2. **Cualquier bot conversacional (WhatsApp/webchat) que se diseñe o describa debe declararse explícitamente como bot** y aclarar que no sustituye asesoría legal, en el primer o segundo mensaje del flujo.
3. **Nunca se solicita directamente a víctimas de una situación migratoria delicada** (deportación inminente, asilo por violencia, etc.) con lenguaje que explote el miedo — el ángulo de venta es responsividad y organización, no urgencia alarmista.
4. **Todo dato estadístico usado en copy público debe poder rastrearse a una fuente real** (ver `docs/05-investigacion-de-mercado.md`). No inventar cifras nuevas para landing pages o anuncios.
5. Estas reglas aplican tanto al contenido que Studio Seikan usa para venderse a sí misma como al contenido que se diseña para los futuros clientes (despachos).

---

## 4. Estructura del repositorio (objetivo — puede no existir aún completa)

```
studio-seikan-ops/
├── CLAUDE.md                          ← este archivo
├── docs/
│   ├── 01-marca-y-diseno.md           ← sistema visual de Studio Seikan
│   ├── 02-landing-page.md             ← spec y contenido de studioseikan.com
│   ├── 03-crm-interno.md              ← PRD del CRM de prospección
│   ├── 04-ventas-y-prospeccion.md     ← roadmap outbound, embudo, guion de auditoría
│   ├── 05-investigacion-de-mercado.md ← datos del nicho, compliance, voice-of-customer
│   └── 06-plantillas-de-mensajes.md   ← templates de outreach por canal y ángulo
├── landing/                           ← código de studioseikan.com
├── crm/                               ← código del CRM interno
│   ├── frontend/                      ← Next.js
│   └── (Supabase se gestiona vía dashboard/CLI, no vive código de infra aquí)
└── scripts/                           ← utilidades de prospección (exportar CSV, etc.)
```

Si alguna carpeta no existe todavía, créala según se necesite — no es necesario generar todo el árbol de una vez.

---

## 5. Stack tecnológico por área

| Área | Stack | Notas |
|---|---|---|
| Landing page | HTML/CSS/JS standalone (archivo único) o Next.js si crece en complejidad | Hoy es un solo archivo `.html` funcional — no migrar a framework sin razón concreta |
| CRM interno | Next.js + Supabase (PostgreSQL) + Supabase Auth (usuario único) | Deploy en Vercel + Supabase, sin VPS |
| Asistente de ventas | Sin código de producción — es trabajo de generación de contenido y análisis, apoyado en los datos que ya viven en el CRM interno una vez construido | |
| Preferencia general de lenguaje de código | JavaScript/TypeScript como primera opción | Preferencia explícita de José |

---

## 6. Convenciones de trabajo

- **Idioma de todo el contenido de cara al usuario/cliente:** español de México, tono directo, sin frases de relleno tipo "¡Claro!" o "espero te encuentres bien".
- **Idioma de código:** nombres de variables/funciones en inglés está bien si es más natural para el stack, pero comentarios de negocio y copy siempre en español.
- **Explicar el "por qué" en decisiones técnicas importantes** antes de implementarlas — no solo ejecutar.
- **Commits (si se usa git):** mensajes en español, formato `área: qué se hizo` — ej. `crm: agrega regla de seguimiento automático a 3/7/14 días`.
- **No sobre-construir:** si un doc de referencia marca algo como "fuera de alcance" o "versión 2", no lo construyas en la versión actual sin que José lo pida explícitamente.

---

## 7. Cómo priorizar cuando hay ambigüedad

Orden de prioridad de negocio, de mayor a menor urgencia:
1. Cualquier tarea que acerque a **conseguir el primer cliente real** (mensajes de prospección, ajustes a landing page para conversión, funcionalidad del CRM que José necesite usar HOY)
2. Mantenimiento/corrección de lo que ya existe y está en uso activo
3. Funcionalidad nueva planeada pero no urgente (ver "Versión 2 / 3" en `docs/03-crm-interno.md`)
4. Pulido estético o refactor sin impacto funcional

Ante la duda, pregunta antes de invertir tiempo en algo que no está claramente en esta lista.

---

## 8. Registro de decisiones (mantener actualizado — agregar entradas nuevas, no borrar históricas)

| Fecha | Decisión | Razón |
|---|---|---|
| Jul 2026 | Nicho final: derecho migratorio en México (se descartó estética/dental) | Mayor cumplimiento como diferenciador, dolor cuantificable, ciclo de venta razonable |
| Jul 2026 | Identidad visual de Studio Seikan: motivo del sello migratorio, paleta tinta/papel/rojo-sello | Diferenciador visual ligado directamente al mundo migratorio, evita clichés genéricos de agencia SaaS |
| Jul 2026 | CRM interno de prospección separado del CRM-producto que se vende a clientes | Evitar confusión de alcance — son sistemas distintos con audiencias distintas |
| Jul 2026 | MVP del CRM interno: sin envío automático de mensajes ni scraping | Evitar scope creep — validar operación manual antes de automatizar |
| Jul 2026 | CRM vive en `crm/` de este mismo repo (renombrado a studio-seikan-ops en GitHub); deploy como proyecto Vercel aparte con Root Directory = `crm` | Un solo repo que mantener, coincide con la estructura objetivo de este archivo |
| Jul 2026 | Métrica de respuesta por canal se calcula desde la tabla `historial_etapas` (log de cambios de etapa), no desde la etapa actual | Un prospecto que respondió y luego fue descartado debe contar como "respondió"; deja listo el dato para conversión de embudo completo (V2) |
| Jul 2026 | Reglas 3/7/14 e historial de etapas implementadas como triggers de PostgreSQL en Supabase, no en el frontend | Consistencia garantizada sin importar desde dónde se mute el dato; el frontend solo hace UPDATEs simples |
| Jul 2026 | Tras el 3er seguimiento (+14 días) sin respuesta, la acción principal ofrecida es "Descartar (no responde)", con opción secundaria de seguimiento manual | El PRD no lo definía; evita prospectos zombis en el pipeline |

Cuando se tome una decisión de negocio o técnica relevante en una sesión, añádela aquí antes de cerrar la sesión.

---

## 9. Equipo de sub-agentes (`.claude/agents/`)

Este proyecto usa 9 sub-agentes especializados en lugar de un solo agente generalista. Invócalos por nombre o deja que Claude Code los delegue automáticamente según su `description`.

| Agente | Rol | Cuándo se activa |
|---|---|---|
| `guardian-cumplimiento` | Revisa cualquier copy público contra las reglas de la sección 3 | Después de generar/editar copy de cara al cliente — siempre antes de publicar |
| `guardian-marca` | Revisa consistencia visual/tono contra `docs/01` | En paralelo a compliance, después de crear/editar piezas visuales |
| `arquitecto-landing` | Construye/mantiene studioseikan.com y MVPs ficticios | Pedidos de cambio en el sitio o portafolio |
| `desarrollador-crm` | Construye/mantiene el CRM interno de prospección | Pedidos de feature/bug fix del CRM interno (no del CRM-producto) |
| `prospector-activo` | Encuentra y califica prospectos nuevos vía Google Maps/directorios/LinkedIn público | Pedidos tipo "consígueme N despachos en [ciudad]" — ver `docs/07` para setup de herramientas |
| `redactor-prospeccion` | Escribe mensajes de outreach personalizados | Cuando se necesita un mensaje para un prospecto específico |
| `analista-metricas` | Reporta el estado real del pipeline | Preguntas tipo "cómo va mi prospección" |
| `investigador-mercado` | Verifica/actualiza datos del sector | Dato nuevo a confirmar o revisión periódica de `docs/05` |
| `asistente-diario` | Genera el plan de acción del día | Inicio de jornada de prospección |

**Regla de flujo:** todo copy o pieza visual nueva pasa por `guardian-cumplimiento` y `guardian-marca` antes de considerarse lista para publicar — ningún otro agente se autoaprueba. `prospector-activo` nunca contacta directamente a un prospecto que encuentra — solo entrega la lista calificada a `redactor-prospeccion`/José para decidir el siguiente paso.

---

## 10. Pendientes conocidos (backlog vivo — actualizar conforme se completen o surjan nuevos)

- [ ] Construir MVP del CRM interno (ver `docs/03-crm-interno.md`, sección de prioridad de construcción)
- [ ] Validar ángulo de mensaje ganador (Abandono / Transparencia / Confianza) con datos reales de Fase 1 del roadmap
- [ ] Construir MVP ficticio de despacho migratorio para portafolio (aún no iniciado)
- [ ] Conseguir primer cliente real para reemplazar portafolio ficticio con caso de éxito documentado
- [ ] Evaluar si migrar landing page de Studio Seikan de HTML standalone a Next.js una vez haya más páginas (blog, casos de éxito)