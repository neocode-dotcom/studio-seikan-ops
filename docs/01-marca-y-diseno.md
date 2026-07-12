# 01 — Marca y Sistema de Diseño · Studio Seikan

Este documento es la fuente de verdad visual. Cualquier pieza nueva (landing page, mockups de demo, material de ventas, futuros anuncios) debe ser consistente con esto salvo decisión explícita de crear una sub-marca distinta (por ejemplo, para un MVP ficticio de cliente).

---

## 1. Concepto central

**El sello migratorio (rubber stamp).** Es el objeto más característico del mundo de migración — cada visa, cada trámite, cada expediente se define por un sello de aprobación. Es el hilo visual de toda la marca: aparece en el logo, en el hero de la web, en tarjetas de estadísticas, en los pasos de proceso, y como confirmación de formularios.

**Por qué este concepto y no otro:** conecta directamente con la audiencia (abogados migratorios) sin caer en los clichés visuales genéricos de agencias de IA (fondo negro + acento neón, o paleta crema+serif+terracota tipo SaaS). El sello es específico al dolor y al mundo del cliente, no decorativo.

---

## 2. Paleta de colores

| Nombre | Hex | Uso |
|---|---|---|
| Tinta (ink) | `#12202B` | Fondo base, secciones oscuras |
| Tinta 2 (ink-2) | `#1B2B38` | Fondo secundario, alternancia de secciones |
| Papel (paper) | `#ECE7DC` | Tarjetas tipo documento, fondo de sección CTA |
| Texto sobre papel | `#1B2B38` | Texto en tarjetas claras |
| Sello (stamp — acento principal) | `#A6362A` | CTAs, acentos, elementos de marca — el color de tinta de un sello migratorio real |
| Sello claro (hover) | `#C2534A` | Estados hover/activo del acento |
| Verde verificado (jade) | `#3E6E5E` | Estados de aprobación, checkmarks, sección de cumplimiento |
| Muted | `#93A0A8` | Texto secundario sobre fondo oscuro |
| Muted oscuro | `#5C6A72` | Texto secundario sobre fondo claro (papel) |
| Border | `rgba(236,231,220,0.14)` | Divisores sutiles sobre fondo oscuro |

**Regla de uso:** el rojo-sello es un acento, no un color dominante. Si más del 15-20% de una sección usa el rojo, se ve alarmante en vez de autoritativo — reservarlo para CTAs, números clave y el motivo del sello.

---

## 3. Tipografía

| Rol | Fuente | Peso/estilo | Por qué |
|---|---|---|---|
| Display (títulos) | Fraunces | 500 normal, 400 itálica para énfasis | Serif con autoridad editorial, sin caer en el cliché de Cormorant Garamond (ya usado en el MVP de nicho anterior, AURUM) |
| Cuerpo | IBM Plex Sans | 300-400 | Elegida por su ADN "de formulario oficial/gubernamental" — coherente con el mundo de trámites y documentos |
| Utilitaria (datos, labels, números) | IBM Plex Mono | 400-500 | Números de estadísticas, labels de formulario, elementos tipo "número de expediente" |

Import de Google Fonts usado en producción:
```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,400&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap
```

---

## 4. Tono de voz

- **Autoridad por precisión, no por decoración.** El público es B2B (abogados) — el exceso de animación o lenguaje "creativo" resta credibilidad en vez de sumarla.
- **Directo, basado en números reales**, nunca en adjetivos vacíos ("revolucionario", "de clase mundial").
- **El copy nunca promete resultados legales** (ver regla de compliance en `CLAUDE.md` sección 3) — se vende organización, velocidad y transparencia, nunca desenlaces de trámites.
- Frases ancla ya validadas y en uso: *"Cada hora sin responder, un caso cruza a la competencia."* / *"La fuga no está en tus anuncios. Está en la respuesta."*

---

## 5. Motivo del sello — especificación técnica de reutilización

El sello se construye en SVG con estos elementos reutilizables:
- Círculo exterior + círculo interior concéntrico (dos `<circle>` con distinto radio y opacidad)
- Texto curvo con `<textPath>` siguiendo un `<path>` de arco
- Rotación base de `-6deg` a `-8deg` para simular el ángulo imperfecto de un sello real presionado a mano
- Animación de "impacto": `scale(1.6) rotate(-20deg)` → `scale(0.94) rotate(-7deg)` → `scale(1) rotate(-8deg)`, con `cubic-bezier(.2,1.4,.4,1)` para el efecto de rebote físico

Usos ya implementados: hero de la landing page, confirmación de envío de formulario. Usos previstos: badges de "cumplimiento verificado" en material de ventas, posible favicon/ícono de marca.

---

## 6. Qué evitar explícitamente

- No usar Three.js ni animaciones 3D pesadas — eso se reservó para el MVP de nicho anterior (AURUM Clinic, estética de lujo) y no es coherente con un público de abogados que valora autoridad sobre espectacularidad.
- No usar la paleta crema+serif+terracota (cliché reconocible de sitios genéricos de IA/SaaS).
- No mezclar el sistema visual de Studio Seikan con el de futuros MVPs ficticios de clientes (ej. el despacho migratorio ficticio de portafolio) — cada uno debe tener su propia identidad, aunque puedan compartir el "lenguaje" del motivo de sello como técnica, adaptado con paleta propia.