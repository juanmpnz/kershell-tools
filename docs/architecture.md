# Arquitectura inicial

Un repositorio y una aplicación Next.js para el primer vertical de vivienda. `packages/calculators` contiene fórmulas puras y comprobables; `apps/web` contiene las páginas indexables y la interfaz. Cada nueva herramienta necesita una página con finalidad propia, método explicado y enlaces relevantes. No se crean paquetes vacíos de SEO, Ads, leads o UI hasta que exista una segunda necesidad real.

## Próximos módulos posibles

1. Cuota hipotecaria y tabla de amortización, indicando claramente supuestos de interés.
2. Comprar frente a alquilar, con costes y horizonte temporal configurables.
3. Coste de reforma, solo tras conseguir rangos verificables por zona y alcance.

La rentabilidad actual es anual, antes de impuestos y financiación. Los costes de adquisición se introducen manualmente; no se infiere el ITP. Esto evita publicar tasas fiscales sin verificar.

## Despliegue en Coolify

- Fuente: este repositorio; método Dockerfile en la raíz; puerto interno `3000`.
- Configurar el dominio HTTPS en Coolify y el argumento de compilación `NEXT_PUBLIC_SITE_URL=https://DOMINIO` (sin barra final).
- El Dockerfile genera el output standalone de Next.js. No requiere PostgreSQL, Redis ni cron para esta primera herramienta.
- Revisar el dominio, sitemap, contenido y medición antes de hacer público el sitio. El proyecto no configura anuncios ni consentimiento de cookies todavía.

## Gastos de compra en Cataluña

`packages/calculators/src/purchase-costs.ts` contiene el cálculo puro; el componente cliente lee los datos y muestra el desglose. No se guardan ni envían importes al servidor. Solo se contempla la compra del pleno dominio de la vivienda en régimen general. Los tramos TUB vigentes desde el 27-06-2025, el IVA del 10 % y AJ4 del 1,5 % se contrastaron con ATC y AEAT el 28-09-2026; la página publica los enlaces y el alcance. Revisar esas fuentes al menos cada trimestre y antes de modificar tarifas o publicar cambios en la calculadora. Actualizar los tests de los límites de los tramos cuando cambie una tarifa.
