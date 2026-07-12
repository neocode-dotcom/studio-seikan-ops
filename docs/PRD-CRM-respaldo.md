# Documento de Requisitos — CRM de Prospección Outbound
## Studio Seikan — Sistema interno de gestión de prospección para despachos migratorios

**Versión:** 1.0
**Fecha:** Julio 2026
**Autor:** José Escobar / Studio Seikan
**Propósito de este documento:** Especificación técnica completa para que Claude Code construya el sistema sin ambigüedad. No es el producto que se vende a clientes — es la herramienta interna que Studio Seikan usa para gestionar su propia prospección outbound.

---

## 1. Contexto y objetivo

### 1.1 Quién usa esto
Un solo usuario (José, fundador de Studio Seikan). No es multi-tenant, no requiere sistema de roles ni permisos complejos. Autenticación simple de un solo usuario es suficiente.

### 1.2 Por qué existe este sistema
Studio Seikan está ejecutando una estrategia de prospección outbound hacia despachos de abogados de migración en México, definida en un roadmap de 4 fases (detallado en la sección 3). El roadmap identificó 11 canales de prospección (Google Maps, LinkedIn, WhatsApp, email frío, grupos de Facebook, alianzas, etc.) y un embudo con 5 métricas clave que hoy no existe forma de trackear de manera centralizada. Sin esta herramienta, el seguimiento se hace en hojas de cálculo sueltas — la misma fuga de información que Studio Seikan le vende a sus clientes como problema a resolver. Este sistema es el "eat your own dog food" de la agencia.

### 1.3 Lo que este sistema NO es
- No es el producto que Studio Seikan vende a despachos legales (ese es un CRM con IA para gestión de leads de pacientes/clientes finales — sistema distinto, ya diseñado en otra conversación)
- No requiere IA generativa en el MVP (se puede añadir en v2 — ver sección 9)
- No requiere app móvil — uso desde laptop/escritorio es suficiente
- No requiere integración de pagos ni facturación

---

## 2. Objetivo de negocio medible

El sistema debe permitir responder, en cualquier momento, sin cálculo manual:

1. ¿Cuántos prospectos tengo en total y en qué etapa está cada uno?
2. ¿Qué canal tiene mejor tasa de respuesta?
3. ¿Cuántas auditorías gratuitas tengo agendadas esta semana?
4. ¿A quién le toca seguimiento HOY?
5. ¿Cuál es mi conversión real de prospecto → auditoría → cliente firmado?

Si el sistema no responde estas 5 preguntas en menos de 10 segundos desde que se abre, el diseño falló.

---

## 3. Mapeo directo al Roadmap de prospección (contexto que debe respetarse)

El roadmap definió 4 fases. El sistema debe soportar el flujo de trabajo de las 4 sin necesidad de rediseño entre fases:

| Fase | Duración | Actividad principal que el sistema debe soportar |
|---|---|---|
| Fase 1 — Validación | Semanas 1-2 | Carga rápida de prospectos en lote, prueba de 3 mensajes distintos por canal, comparación de tasas de respuesta |
| Fase 2 — Operación diaria | Semanas 3-6 | Rutina diaria de 4 bloques (agregar prospectos, primer contacto, seguimientos, interacción en grupos) — el sistema debe decirle a José qué hacer hoy sin que él tenga que recordarlo |
| Fase 3 — Diversificación | Semanas 7-12 | Múltiples canales activos simultáneos + gestión de alianzas de referidos (entidad distinta a los prospectos directos) |
| Fase 4 — Escalar | Mes 4+ | Reportería comparativa por canal para decidir dónde duplicar esfuerzo y dónde cortar |

Los 11 canales identificados en el roadmap que el sistema debe soportar como valores de campo "canal":
Google Maps, Colegios/barras de abogados, Email frío, LinkedIn, Grupos de Facebook (expats), Comunidades de expats (contenido), Alianzas B2B, Eventos/webinars, YouTube/comentarios, Referido directo, Inbound propio.

---

## 4. Módulos funcionales

### Módulo 1 — Gestión de Prospectos (core del sistema)

**Requisito funcional:** CRUD completo de prospectos con los siguientes campos obligatorios y opcionales.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| Nombre del despacho | texto | Sí | |
| Nombre del contacto (abogado) | texto | Sí | |
| Ciudad | texto | Sí | Para filtrar por mercado — roadmap prioriza CDMX, Tijuana, Guadalajara |
| Canal de origen | selección única | Sí | Los 11 valores de la sección 3 |
| Teléfono/WhatsApp | texto | No | |
| Email | texto | No | |
| LinkedIn/redes | texto (URL) | No | |
| Fuente de calificación | texto libre | No | Ej: "reseña de Google mencionando mala respuesta" — para recordar por qué se calificó |
| Especialidad migratoria | selección múltiple | No | Visa de trabajo, Residencia temporal, Residencia permanente, Asilo/refugio, Naturalización, Reunificación familiar, General |
| Etapa del embudo | selección única | Sí | Ver sub-sección 4.1 — este es el campo más importante del sistema |
| Ángulo de mensaje usado | selección única | No | Abandono, Transparencia, Confianza/vetting — para la comparación de Fase 1 |
| Fecha de primer contacto | fecha | No (se llena al mover a "Contactado") | |
| Fecha de próximo seguimiento | fecha | No | El sistema debe calcular esta fecha automáticamente según reglas de la sub-sección 4.2 |
| Notas | texto largo, histórico tipo "log" | No | Cada nota lleva timestamp automático, no se sobrescriben, se acumulan cronológicamente |
| Score de prioridad | número 1-5 o alto/medio/bajo | No | Manual, criterio de José |

#### 4.1 Etapas del embudo (pipeline) — deben ser una lista fija, no editable por el usuario en el MVP

1. **Identificado** — está en la lista, no contactado aún
2. **Contactado** — primer mensaje enviado
3. **Respondió** — hubo respuesta, conversación activa
4. **Auditoría agendada** — se agendó la llamada de auditoría gratuita
5. **Auditoría realizada** — la llamada ya ocurrió
6. **Propuesta enviada** — se envió cotización/propuesta post-auditoría
7. **Cliente firmado** — cerrado ganado
8. **Descartado** — cerrado perdido (debe pedir un motivo al mover aquí: no responde, no calificó, presupuesto, no es buen fit, otro)

El sistema debe mostrar visualmente estas 8 etapas como columnas estilo kanban (drag-and-drop) además de la vista de tabla/lista. Ambas vistas deben ser intercambiables sin recargar la página.

#### 4.2 Reglas de seguimiento automático (el corazón operativo del sistema)

El roadmap especifica seguimientos en día 3, día 7 y día 14 tras el contacto. El sistema debe:

- Al mover un prospecto a "Contactado", calcular y guardar automáticamente 3 fechas de seguimiento sugeridas: +3 días, +7 días, +14 días desde la fecha de contacto
- Mostrar en el dashboard principal (ver Módulo 4) una lista de "Seguimientos de hoy" — todos los prospectos cuya fecha de próximo seguimiento sea igual o anterior a la fecha actual y que NO estén en etapa "Cliente firmado" o "Descartado"
- Al completar un seguimiento (José marca "seguimiento hecho" y agrega una nota), el sistema pregunta si se agenda el siguiente seguimiento automático o si el prospecto avanza de etapa
- Si un prospecto lleva más de 14 días sin ninguna actualización de etapa ni nota nueva, debe aparecer resaltado visualmente (ej. borde rojo o badge "estancado") en todas las vistas donde aparezca

### Módulo 2 — Gestión de Alianzas B2B (entidad separada de prospectos)

La Fase 3 del roadmap identifica un tipo de relación distinto: alianzas de referidos cruzados con negocios adyacentes (agencias de relocation, inmobiliarias, notarías, academias de español). Esto NO es un prospecto de venta directa — es una relación de partnership bidireccional.

**Campos requeridos:**

| Campo | Tipo | Notas |
|---|---|---|
| Nombre del negocio | texto | |
| Tipo de negocio | selección | Relocation, Inmobiliaria, Notaría, Academia de idiomas, Otro |
| Contacto | texto | |
| Estado de la alianza | selección | Contactado, En conversación, Acuerdo activo, Inactivo |
| Referidos enviados (contador) | número | Cuántos clientes le ha referido Studio Seikan a este partner |
| Referidos recibidos (contador) | número | Cuántos despachos le ha referido este partner a Studio Seikan |
| Notas | texto largo con historial | |

Este módulo puede ser una tabla simple, no necesita kanban.

### Módulo 3 — Plantillas de mensajes por canal y ángulo

La Fase 1 del roadmap requiere probar 3 ángulos de mensaje (Abandono, Transparencia, Confianza) en distintos canales simultáneamente y comparar resultados.

**Requisito funcional:**
- CRUD de plantillas de mensaje, cada una con: nombre, canal aplicable, ángulo, cuerpo del texto (con variables tipo `{nombre_despacho}` y `{nombre_contacto}` para personalización manual al copiar)
- Botón "copiar al portapapeles" con las variables ya sustituidas usando los datos del prospecto seleccionado
- Al enviar un mensaje desde una plantilla a un prospecto específico, el sistema debe registrar automáticamente en las notas del prospecto qué plantilla/ángulo se usó y la fecha — esto alimenta las métricas del Módulo 4

### Módulo 4 — Dashboard de métricas (debe responder las 5 preguntas de la sección 2)

**Vista principal al abrir el sistema**, con estos componentes obligatorios:

1. **Tarjeta "Seguimientos de hoy"** — lista accionable, no solo contador, con acceso directo a cada prospecto
2. **Embudo visual** — cantidad de prospectos en cada una de las 8 etapas (gráfico de barras horizontal tipo funnel)
3. **Tasa de respuesta por canal** — tabla comparativa: Canal | Contactados | Respondieron | % de respuesta — ordenada de mayor a menor tasa
4. **Tasa de respuesta por ángulo de mensaje** — misma lógica que el punto anterior, pero agrupado por Abandono/Transparencia/Confianza en lugar de canal
5. **Conversión del embudo completo** — Identificados → Contactados → Respondieron → Auditoría agendada → Auditoría realizada → Cliente firmado, con porcentaje de conversión entre cada paso consecutivo
6. **Actividad de la semana** — contador simple de: prospectos agregados esta semana, contactos realizados esta semana, auditorías agendadas esta semana (para medir consistencia contra las metas de la Fase 2: 10 agregados/día, 10 contactos/día)
7. **Filtro de fecha** — todo el dashboard debe poder filtrarse por rango de fechas (última semana, último mes, todo el tiempo, rango personalizado)

### Módulo 5 — Calendario de auditorías

Vista de calendario simple (semana/mes) mostrando únicamente los prospectos en etapa "Auditoría agendada", con fecha/hora de la cita. Debe permitir:
- Ver el detalle del prospecto al hacer click en el evento
- Marcar como "realizada" directamente desde el calendario (esto mueve automáticamente la etapa a "Auditoría realizada")
- Idealmente, aunque no es obligatorio para el MVP: opción de exportar/sincronizar con Google Calendar

---

## 5. Modelo de datos (Supabase / PostgreSQL)

Dado que el stack ya definido para las herramientas de Studio Seikan usa Supabase, este sistema debe usar la misma base para consistencia futura (aunque sea un proyecto/base separada).

### Tabla `prospectos`
```
id (uuid, PK)
nombre_despacho (text, not null)
nombre_contacto (text, not null)
ciudad (text, not null)
canal_origen (text, not null) -- enum controlado por la app
telefono (text, nullable)
email (text, nullable)
linkedin_url (text, nullable)
fuente_calificacion (text, nullable)
especialidad_migratoria (text[], nullable) -- array para selección múltiple
etapa (text, not null, default 'identificado') -- enum de 8 valores
angulo_mensaje (text, nullable)
fecha_primer_contacto (timestamp, nullable)
fecha_proximo_seguimiento (timestamp, nullable)
score_prioridad (integer, nullable) -- 1 a 5
motivo_descarte (text, nullable) -- solo aplica si etapa = 'descartado'
created_at (timestamp, default now())
updated_at (timestamp, auto-update on change)
```

### Tabla `notas_prospecto`
```
id (uuid, PK)
prospecto_id (uuid, FK -> prospectos.id)
contenido (text, not null)
created_at (timestamp, default now())
```
Nota: se usa tabla separada en lugar de un campo de texto único para preservar historial cronológico completo sin sobrescritura, según requisito de la sección 4.

### Tabla `alianzas`
```
id (uuid, PK)
nombre_negocio (text, not null)
tipo_negocio (text, not null)
contacto (text, nullable)
estado (text, not null, default 'contactado')
referidos_enviados (integer, default 0)
referidos_recibidos (integer, default 0)
created_at (timestamp, default now())
```

### Tabla `notas_alianza`
Misma estructura que `notas_prospecto` pero con FK a `alianzas.id`.

### Tabla `plantillas_mensaje`
```
id (uuid, PK)
nombre (text, not null)
canal (text, not null)
angulo (text, not null)
cuerpo (text, not null)
created_at (timestamp, default now())
```

### Tabla `envios_mensaje` (para trackear qué plantilla se usó con qué prospecto y cuándo — alimenta métricas)
```
id (uuid, PK)
prospecto_id (uuid, FK -> prospectos.id)
plantilla_id (uuid, FK -> plantillas_mensaje.id, nullable)
canal (text, not null)
angulo (text, not null)
fecha_envio (timestamp, default now())
obtuvo_respuesta (boolean, default false, nullable) -- se actualiza manualmente cuando el prospecto responde
```

### Tabla `auditorias`
```
id (uuid, PK)
prospecto_id (uuid, FK -> prospectos.id, not null)
fecha_hora (timestamp, not null)
realizada (boolean, default false)
notas_resultado (text, nullable)
created_at (timestamp, default now())
```

---

## 6. Requisitos no funcionales

| Categoría | Requisito |
|---|---|
| Stack backend | Node.js |
| Base de datos | Supabase (PostgreSQL) |
| Frontend | Next.js (preferencia ya establecida por José para consistencia con otras herramientas) |
| Autenticación | Un solo usuario — puede ser tan simple como login con email/password de Supabase Auth, sin necesidad de roles ni multi-usuario |
| Hosting | Debe poder desplegarse en Vercel (frontend) + Supabase (backend/DB) sin necesidad de VPS — este es un sistema interno de bajo tráfico, no requiere la infraestructura reservada para clientes reales |
| Responsive | Debe funcionar bien en laptop (uso principal) y ser usable en móvil para consultas rápidas en campo, aunque el diseño mobile no necesita ser tan pulido como el desktop |
| Rendimiento | Con el volumen esperado (decenas a cientos de prospectos, no miles), no hay requisitos especiales de optimización — priorizar velocidad de desarrollo sobre escalabilidad prematura |
| Idioma | Toda la interfaz en español |
| Exportación de datos | Debe existir un botón de exportar la tabla de prospectos a CSV, para respaldo y para poder analizar en Excel/Sheets si es necesario |

---

## 7. Prioridad de construcción (para no sobre-construir de una vez)

### MVP (lo que se construye primero, funcional en 1-2 sesiones con Claude Code)
- Módulo 1 completo (CRUD de prospectos + kanban + lista)
- Módulo 4, puntos 1, 2 y 3 únicamente (seguimientos de hoy, embudo visual, tasa de respuesta por canal)
- Reglas de seguimiento automático (sección 4.2)

### Versión 2 (una vez el MVP esté en uso real durante la Fase 1-2 del roadmap)
- Módulo 3 (plantillas de mensaje) — tiene sentido añadirlo cuando ya haya mensajes reales que valga la pena guardar como plantilla
- Módulo 4 completo (puntos 4, 5, 6, 7)
- Módulo 5 (calendario de auditorías)

### Versión 3 (Fase 3-4 del roadmap, cuando haya volumen y alianzas activas)
- Módulo 2 (alianzas B2B)
- Exportación CSV
- Posible IA: resumen automático de notas de un prospecto, sugerencia de próxima acción basada en patrones de prospectos similares que sí convirtieron

No construir la versión 3 antes de tener datos reales de las fases anteriores — construir scoring o sugerencias de IA sin datos reales es adivinar, no optimizar.

---

## 8. Criterios de aceptación (cómo saber que el MVP está terminado)

El MVP se considera terminado cuando José puede, sin tocar ninguna hoja de cálculo externa:

1. Agregar un prospecto nuevo en menos de 30 segundos
2. Ver de un vistazo cuántos prospectos tiene en cada etapa del embudo
3. Abrir el sistema en la mañana y ver exactamente a quién debe darle seguimiento ese día
4. Mover un prospecto de etapa arrastrándolo en la vista kanban
5. Ver, después de tener al menos 20 prospectos contactados por al menos 2 canales distintos, cuál canal tiene mejor tasa de respuesta

---

## 9. Fuera de alcance (explícitamente, para evitar scope creep con Claude Code)

- No incluir envío automático de mensajes (WhatsApp/email) desde el sistema — en el MVP, José copia la plantilla y la envía manualmente desde su propio WhatsApp/correo. Automatizar el envío es un proyecto de integración de API distinto (WhatsApp Business API, SMTP) que se evalúa después
- No incluir scraping automático de Google Maps o LinkedIn — la carga de prospectos es manual en el MVP
- No incluir facturación, cotizaciones ni generación de contratos
- No incluir multi-usuario ni permisos de equipo
- No incluir notificaciones push ni por email de "tienes seguimientos pendientes" en el MVP — el usuario revisa el dashboard activamente

---

## 10. Nota de contexto adicional para Claude Code

Este sistema es una herramienta interna de una agencia de automatización con IA (Studio Seikan) que vende sistemas similares —pero mucho más completos, con bots de WhatsApp y CRMs con IA— a despachos de abogados de migración en México como clientes. Este CRM de prospección es deliberadamente más simple que el producto que se vende, porque su único usuario es el fundador de la agencia gestionando su propio pipeline de ventas, no un producto client-facing. Mantener la complejidad proporcional a ese uso real.