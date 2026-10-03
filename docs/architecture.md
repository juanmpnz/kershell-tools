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


## Live / Parking: webcam propia

`/live` presenta el vertical y `/live/parking` permite guardar una URL propia y mapear manualmente plazas de una cámara fija. El público son usuarios que quieren volver a consultar un parking de su elección. Se mantiene `noindex` mientras la detección es experimental, sin alterar las rutas ni las fórmulas de las calculadoras.

La ruta usa `components/parking/parking-workspace.tsx`. `camera-feed.tsx` gestiona imágenes/vídeo/HLS y errores; `slot-map.tsx` edita polígonos normalizados; `use-vehicle-tracking.ts` ejecuta COCO-SSD bajo demanda; `lib/parking/camera.ts` valida la configuración y calcula la ocupación estimada. URL y mapa se guardan en localStorage; las imágenes y las inferencias permanecen en el navegador. No hay backend de visión ni proxy de URLs.

Las dependencias de reproducción e inferencia se cargan dinámicamente. La descarga inicial del modelo y el consumo de CPU/GPU son costes del dispositivo del usuario, no del servidor de Kershell. La ausencia de un vehículo detectado no garantiza que la plaza esté vacía. Véanse [funcionamiento, fuentes y validación](./parking-live.md).

El contrato y monitor de disponibilidad desarrollados anteriormente permanecen aislados y probados para una posible integración de proveedor; no gobiernan la nueva ruta pública y no hay un endpoint de disponibilidad desplegado.
