# Kershell Tools

Herramientas claras para decisiones sobre vivienda y trabajo: rentabilidad de alquiler, alquiler con hipoteca, gastos de compra de vivienda en Cataluña e indemnización por despido en España. Cada página muestra su método, fuentes y límites.

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


## Parking Live

En `/live/parking`, pega una URL directa HTTPS de imagen, vídeo o HLS; marca las cuatro esquinas de cada plaza e inicia el seguimiento. La URL y el mapa se guardan en localStorage, solo en ese navegador. El detector se ejecuta localmente mientras la pestaña está visible; las imágenes no se envían a Kershell. Las fuentes que bloquean lectura de píxeles pueden ser solo de consulta. No se aceptan páginas de YouTube, iframes ni RTSP como streams directos. Consulta [alcance y límites experimentales](docs/parking-live.md).

## Alquiler con hipoteca

En `/alquiler-con-hipoteca`, estima el efectivo del primer año de una compra para alquilar con hipoteca nueva: cuota francesa, ocupación, gastos, alquiler de equilibrio y retorno del efectivo sobre aportación inicial. Separa intereses y capital amortizado. Los valores iniciales son un escenario ilustrativo, no tipos de mercado. Consulta [método, fuentes y revisión](docs/rental-mortgage.md).

## Plantilla Excel de rentabilidad

La página de rentabilidad ofrece `/descargas/plantilla-rentabilidad-alquiler.xlsx`. Es una hoja editable con fórmulas propias que reproducen los valores iniciales y los cálculos brutos/netos de `calculateRentalYield`. Los campos amarillos cambian el resultado sin conexión. El archivo es estático, no contiene macros ni envía los datos introducidos. Revisar la hoja si se cambia el método de la calculadora.
