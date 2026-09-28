# Kershell Tools

Herramientas claras para decisiones sobre vivienda: rentabilidad de alquiler y gastos de compra de vivienda en Cataluña. La calculadora de compra estima el régimen general de vivienda usada o nueva y muestra sus fuentes oficiales y límites.

## Desarrollo

Requiere Node.js 24 y pnpm 11.25.

```bash
corepack enable
pnpm install
pnpm dev
```

Abre `http://localhost:3000`. Verifica con `pnpm typecheck`, `pnpm test` y `pnpm build`.

## Estructura

- `apps/web`: Next.js App Router, páginas públicas y diseño.
- `packages/calculators`: cálculos puros con tests de casos reales y límites.
- `docs/architecture.md`: decisiones y despliegue en Coolify.

El resultado de rentabilidad es una estimación antes de impuestos y financiación. La calculadora de compra aplica tarifas generales consultadas el 28-09-2026; comprueba las condiciones de tu caso antes de firmar. No se recogen datos del usuario ni se integran anuncios en esta versión.

Para producción configura `NEXT_PUBLIC_SITE_URL` con el origen HTTPS definitivo durante la compilación. La imagen Docker expone el puerto 3000; consulta [despliegue](docs/architecture.md).
