# 02 — Landing Page · studioseikan.com

## 1. Estado actual

Existe una primera versión funcional como archivo HTML standalone (`landing/index.html` — mover aquí el archivo ya generado si no está en el repo todavía). Construida siguiendo el sistema de marca de `01-marca-y-diseno.md`. Antes de modificar, leer ese documento.

**Objetivo único de esta página:** que un abogado/dueño de despacho migratorio agende una auditoría gratuita. Todo elemento de la página debe evaluarse contra ese objetivo — si no ayuda a la conversión, se corta.

---

## 2. Estructura de secciones (orden fijo salvo que se decida rediseñar)

| # | Sección | Propósito | Elemento distintivo |
|---|---|---|---|
| 1 | Nav | Navegación + CTA persistente | Logo con marca circular tipo sello |
| 2 | Hero | Gancho principal + CTA doble | Animación de sello grande al cargar (`< 5 MIN · TIEMPO DE RESPUESTA`) |
| 3 | Problema | Instalar el dolor con datos reales | 4 tarjetas tipo papel con estadísticas (42 hrs, 14%, 35%, 1 de 5) — ver fuente en `05-investigacion-de-mercado.md` |
| 4 | Solución | Las 4 piezas del sistema | Lista numerada (no cards) — el orden 01-04 es funcional, representa la secuencia real del embudo: Web → Ads → Bot → CRM |
| 5 | Cumplimiento | Diferenciador frente a agencias genéricas | Badge circular + lista de 4 puntos con checkmarks verdes |
| 6 | Proceso | Cómo se trabaja con la agencia | 4 tarjetas con ícono tipo sello numerado |
| 7 | CTA final | Conversión — formulario | Confirmación con animación de sello "SOLICITUD RECIBIDA" |
| 8 | Footer | Cierre, links, copyright | |

---

## 3. Copy de referencia (headline y mensajes clave ya validados — no reinventar sin razón)

- **Hero headline:** "Cada hora sin responder, un caso cruza a la competencia"
- **Hero sub:** "Diseñamos el sistema de captación de clientes para despachos de migración: sitio web, anuncios, bot de WhatsApp y CRM con IA — todo construido para responder en minutos, no en días."
- **Problema — título:** "La fuga no está en tus anuncios. Está en la respuesta."
- **Solución — título:** "Cuatro piezas. Un solo objetivo: que nadie se quede sin respuesta."
- **CTA final — título:** "¿Cuántos casos se te fueron este mes por no responder a tiempo?"

Estadísticas usadas en la sección Problema (ver fuentes completas en `05-investigacion-de-mercado.md` antes de modificar o citar en cualquier otro material):
- 42 HRS — tiempo promedio de respuesta a un caso nuevo en despachos sin sistema
- 14% — de los leads que llegan a convertirse en cliente firmado
- 35% — de llamadas entrantes que nunca se contestan
- 1 DE 5 — consultas agendadas que no se presentan a la cita

---

## 4. Las 4 piezas del sistema (copy exacto de la sección Solución)

1. **Sitio de alta conversión** — la primera impresión que genera confianza en un momento de incertidumbre migratoria.
2. **Meta Ads con creativos de IA** — tráfico calificado por tipo de trámite (visa, residencia, asilo, ciudadanía).
3. **Bot de WhatsApp** — califica, responde FAQs, agenda 24/7. Nunca da asesoría legal.
4. **CRM con inteligencia artificial** — organiza cada caso, puntúa urgencia, dispara seguimiento automático.

---

## 5. Sección de cumplimiento (copy exacto — no diluir esta sección, es el diferenciador de venta)

- El bot se declara como bot y aclara que no sustituye asesoría legal.
- Ningún anuncio promete resultados.
- Datos protegidos por diseño — consentimiento explícito.
- El abogado siempre decide — el sistema captura y organiza, la asesoría legal siempre pasa por él/ella.

---

## 6. Formulario de contacto (CTA final)

Campos: Nombre, Despacho, WhatsApp, Área principal (select: Migratorio-visas y residencia / Migratorio-asilo y refugio / Migratorio-naturalización / Otra área legal).

Al enviar: animación de sello "SOLICITUD RECIBIDA" con círculo verde jade, no rojo-sello (el verde comunica aprobación/éxito, reservar el rojo para acentos de marca, no para confirmaciones).

**Pendiente de decisión:** el formulario actual no tiene backend real (feedback visual únicamente). Antes de recibir tráfico pagado real, decidir: ¿conecta a WhatsApp Business directo, a un webhook simple, o a una tabla de Supabase compartida con el CRM interno? Esto debe resolverse antes de correr cualquier campaña de Meta Ads real.

---

## 7. Especificaciones técnicas

- Un solo archivo HTML con CSS y JS embebidos (sin build step) — decisión deliberada para velocidad de iteración en esta etapa
- Sin librerías 3D — ver razón en `01-marca-y-diseno.md` sección 6
- Scroll reveal vía `IntersectionObserver`, sin librerías externas de animación
- Responsive con breakpoints en 900px y 640px
- Respeta `prefers-reduced-motion`
- Fuentes vía Google Fonts (ver import exacto en `01-marca-y-diseno.md`)

---

## 8. Checklist de mantenimiento antes de cualquier cambio

- [ ] ¿El cambio es consistente con `01-marca-y-diseno.md`?
- [ ] ¿Alguna estadística nueva tiene fuente verificable en `05-investigacion-de-mercado.md`?
- [ ] ¿El copy nuevo viola alguna regla de compliance de `CLAUDE.md` sección 3?
- [ ] ¿El formulario sigue funcionando (aunque sea con feedback visual) después del cambio?
- [ ] ¿Se probó en mobile (breakpoint 640px)?

## 9. Backlog de esta área (no construir sin pedido explícito de José)

- [ ] Conectar el formulario a un backend real (decidir destino — ver sección 6)
- [ ] Sección de caso de éxito / testimonio, una vez exista un cliente real
- [ ] Posible blog/sección de contenido si se decide reforzar inbound desde la propia web de agencia
- [ ] Evaluar analítica básica (Plausible o similar liviano, evitar Google Analytics por peso/privacidad) una vez haya tráfico pagado