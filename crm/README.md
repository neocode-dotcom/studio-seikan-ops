# CRM interno de prospección · Studio Seikan

Herramienta interna de un solo usuario (José) para gestionar el pipeline de prospección hacia despachos migratorios. **No** es el CRM que se vende a clientes. PRD canónico: `../docs/03-crm-interno.md`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind 4 · Supabase (PostgreSQL + Auth SSR) · TanStack Query · dnd-kit.

## Correr en local

```bash
npm install
cp .env.example .env.local   # y rellena con las credenciales reales de Supabase
npm run dev
```

El usuario se crea a mano en el dashboard de Supabase (no hay registro en la app).

## Deploy

Vercel con **Root Directory = `crm`**. Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Arquitectura (resumen)

- `lib/etapas.ts` — fuente de verdad de las 8 etapas del embudo (sincronizada con `docs/04`).
- `lib/canales.ts` — 11 canales de prospección.
- `hooks/useProspectos.ts` — acceso a datos + mutaciones (TanStack Query).
- `proxy.ts` + `lib/supabase/*` — auth con cookies; protege todo excepto `/login`.
- `app/(app)/` — rutas autenticadas (dashboard en `/`, prospectos en `/prospectos`).

La lógica de seguimientos 3/7/14 días, `fecha_primer_contacto`, `historial_etapas` y `updated_at` vive en **triggers de la base de datos**; el frontend no la duplica.
