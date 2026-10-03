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

## Indemnización por despido (España)

El vertical de trabajo cubre una decisión económica personal distinta, con una página propia y límites explícitos. `packages/calculators/src/dismissal-compensation.ts` calcula los dos escenarios generales (objetivo e improcedente), incluida la disposición transitoria 11 para contratos anteriores al 12-02-2012. No decide la calificación jurídica. El cliente no almacena ni transmite los datos introducidos. Fuentes: texto consolidado del Estatuto de los Trabajadores (arts. 53, 56 y 59, DT 11) en BOE y guía de la calculadora del CGPJ, consultados el 29-09-2026. Revisar ambos al menos trimestralmente y antes de modificar la fórmula. Comprobar también el criterio jurisprudencial para el salario regulador y la antigüedad; los casos de salario variable, discontinuidad o relación especial quedan expresamente excluidos.


## Live / Parking (demostración)

`/live` presenta el nuevo vertical para personas que viajan a destinos de montaña; se accede desde la portada sin cambiar las rutas de las calculadoras. `/live/parking` muestra un escenario ficticio de Les Angles con 127 plazas libres y 183 ocupadas. No representa capacidad real, disponibilidad ni una integración acordada. La confianza y la última actualización se muestran como no disponibles. Parking lleva `noindex` y queda fuera del sitemap mientras solo contiene una demostración.

Ambas páginas son componentes de servidor, reutilizan el layout y las clases visuales existentes. `app/live/parking/parking.css` limita los ajustes al nuevo panel. No hay nuevas dependencias, peticiones externas, almacenamiento ni backend de visión.

Siguiente paso: confirmar una fuente de cámara autorizada y su encuadre para Les Angles; definir entonces el contrato de disponibilidad (identificador, capacidad validada, libres/ocupadas/desconocidas, confianza, fecha de captura y estado de fuente). Sustituir el snapshot de ejemplo por un adaptador que distinga datos recientes, antiguos, ausentes y errores. Integrar la webcam con su marca temporal antes de conectar el servicio de detección; no mostrar cero plazas como sustituto de datos ausentes. Validar las plazas visibles y la fiabilidad antes de publicar cifras reales o habilitar la indexación.
