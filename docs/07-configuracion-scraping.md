# 07 — Configuración de Herramientas de Scraping (prospector-activo)

Este documento es la guía práctica de setup para que `prospector-activo` tenga acceso real a Apify y/o automatización de navegador, en lugar de depender solo del método de respaldo (WebSearch/WebFetch manual, más lento y menos confiable).

**Léelo antes de invocar al agente esperando resultados a volumen** — sin esta configuración, el agente funciona pero con un techo bajo de resultados por sesión.

---

## 1. Opción principal: Apify (recomendada para Google Maps)

Apify es una plataforma de scraping-as-a-service con "actors" (scrapers ya construidos y mantenidos por terceros) para las fuentes más comunes, incluyendo Google Maps. Es la vía más estable porque no dependes de que Claude Code navegue el sitio en vivo — el actor ya maneja paginación, anti-bloqueo básico, y devuelve un JSON limpio.

### 1.1 Cuenta y costo
- Crea cuenta en apify.com — tiene un plan gratuito con créditos limitados mensuales, suficiente para volumen de prospección de una sola persona en las primeras fases.
- El actor de Google Maps más usado y mantenido es **"Google Maps Scraper"** (por Compass/otros mantenedores) — búscalo directo en el Apify Store dentro de tu cuenta, los IDs de actor cambian de mantenedor a mantenedor así que verifica el actor activo al momento de configurar, no asumas un ID fijo de memoria.
- Costo: se cobra por uso (créditos de plataforma), no es una suscripción fija — revisa el pricing del actor específico antes de correr un scraping grande.

### 1.2 Dos formas de conectarlo a Claude Code

**Forma A — Apify tiene un servidor MCP oficial.** Si está disponible al momento en que configures esto, es la integración más directa: se agrega como servidor MCP en tu `.mcp.json` de proyecto y expone los actors como tools invocables directamente por el agente, sin que tengas que escribir llamadas HTTP a mano. Verifica en la documentación oficial de Apify (docs.apify.com) la sección de MCP para el nombre exacto del paquete/servidor y el formato de configuración vigente al momento — estas integraciones cambian de nombre/versión con el tiempo, así que no copies un JSON de configuración de memoria sin confirmarlo contra la documentación actual.

**Forma B — Llamada directa a la API REST de Apify vía Bash (más simple de configurar, funciona siempre).** No requiere servidor MCP, solo un token de API:

```bash
# Ejemplo de estructura de llamada (ajustar actor_id y parámetros según el actor real que elijas)
curl "https://api.apify.com/v2/acts/{actor_id}/runs?token=$APIFY_API_TOKEN" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "searchStringsArray": ["abogado migración Tijuana"],
    "maxCrawledPlaces": 20,
    "language": "es"
  }'
```

Luego se consulta el resultado del run y se descarga el dataset:
```bash
curl "https://api.apify.com/v2/datasets/{dataset_id}/items?token=$APIFY_API_TOKEN"
```

Guarda tu `APIFY_API_TOKEN` como variable de entorno local, nunca lo escribas directamente en un archivo del repo ni lo subas a git.

**Recomendación:** empieza con la Forma B (API REST directa) porque no depende de que un servidor MCP específico exista o esté actualizado — es más simple y no se rompe si Apify cambia su oferta de integración MCP. Migra a la Forma A solo si confirmas que el servidor MCP oficial está disponible y estable.

---

## 2. Opción de respaldo: automatización de navegador (Playwright MCP)

Para cuando necesites extraer datos de una página que no tiene actor de Apify disponible, o para verificar visualmente un resultado.

- Existe un servidor MCP de Playwright (automatización de navegador) mantenido por la comunidad/Microsoft — revisa la documentación actual de Model Context Protocol servers para el nombre exacto del paquete vigente al momento de instalarlo, ya que este ecosistema crece rápido y los nombres de paquete pueden variar.
- Se configura típicamente en el `.mcp.json` de tu proyecto de Claude Code con un bloque tipo:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@paquete-vigente/mcp-server-playwright"]
    }
  }
}
```

(Verifica el nombre real del paquete en el momento de configurar — no lo tomes como definitivo de este documento.)

- Una vez conectado, el agente `prospector-activo` puede usarlo para navegar y extraer contenido de páginas puntuales — pero recuerda las reglas del agente: nunca lo uses para navegar con sesión autenticada en LinkedIn o Facebook, y nunca para resolver CAPTCHAs.

---

## 3. Qué NO vale la pena automatizar (y por qué ya quedó fuera del diseño del agente)

| Canal | Por qué se dejó manual |
|---|---|
| LinkedIn (más allá de búsqueda pública) | Detección y ban de cuentas agresivo, ToS lo prohíbe explícitamente |
| Grupos de Facebook | Requiere sesión autenticada, alto riesgo de bloqueo de cuenta |
| Envío de mensajes (cualquier canal) | Es una decisión deliberada de mantenerlo bajo supervisión humana — automatizar el envío es un proyecto distinto, de mayor riesgo reputacional (spam) y no es lo que se pidió para este agente |

---

## 4. Checklist de configuración antes de usar prospector-activo en volumen

- [ ] Cuenta de Apify creada y token de API guardado como variable de entorno
- [ ] Confirmado el actor de Google Maps vigente en Apify Store (nombre/ID puede haber cambiado)
- [ ] Probada una llamada de prueba con un límite bajo (5-10 resultados) antes de correr un scraping grande, para validar formato de respuesta
- [ ] (Opcional) Servidor Playwright MCP configurado si se necesita extracción puntual fuera de Apify
- [ ] Revisado que ningún token/credencial quedó escrito directamente en archivos del repo

## 5. Nota de mantenimiento de este documento
Este documento describe integraciones de terceros (Apify, servidores MCP de la comunidad) que cambian de nombre, precio o disponibilidad con el tiempo. Si `prospector-activo` reporta que un método descrito aquí ya no funciona como se documentó, actualiza esta sección con lo que encuentres vigente — no asumas que la configuración quedó estática desde que se escribió este documento.