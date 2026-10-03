# Parking Live: contrato y fuente candidata

## Investigación — 3 de octubre de 2026

La [página oficial de webcams](https://lesangles.com/es/webcam/) presenta Bas de station, Les Jassettes, Plateau de Bigorre, Roc d’Aude y Snowpark. El primer reproductor enlazado es [Viewsurf: Les Angles — Bas de Station](https://pv.viewsurf.com/2586/Les-Angles-Bas-de-station?i=ODY5MDp1bmRlZmluZWQ). Es una fuente candidata, no una cámara de parking validada: no se ha comprobado que el encuadre permita identificar todas las plazas, que sea fijo o que aporte capturas con la frecuencia requerida. Tampoco se ha verificado la capacidad de ningún parking.

Los [avisos legales de Les Angles](https://lesangles.com/mentions-legales/) reservan los derechos de reproducción y adaptación y exigen acuerdo previo expreso. No se ha obtenido autorización para embeber, capturar o analizar el contenido. La UI enlaza a la página oficial sin cargar recursos del proveedor. No existe aún una fuente apta y autorizada confirmada.

Contacto publicado en la página de webcams: lesanglesinfos@les-angles.com. No se ha enviado ningún mensaje. Antes de integrar, solicitar confirmación del titular y del proveedor sobre: reproducción del reproductor, acceso automatizado a capturas, generación y publicación comercial de datos derivados, frecuencia permitida y atribución. Pedir una fuente fija con fecha de captura y confirmar el área visible y las plazas calibradas.

## Contrato interno v1

Implementación: `apps/web/lib/parking/availability.ts`. No hay endpoint ni servicio de visión. El adaptador `readAvailability` recibe `unknown`, valida y produce un estado seguro para `ParkingAvailability`. La demo está separada en `demo.ts`: no debe convertirse en fallback de una fuente real.

Ejemplo de forma del contrato (todos los valores son ilustrativos):

```json
{
  "version": 1,
  "parkingId": "les-angles-pilot",
  "sourceId": "camera-1",
  "capturedAt": "2026-10-03T11:59:00.000Z",
  "capacity": 100,
  "available": 20,
  "occupied": 70,
  "unknown": 10,
  "confidence": 0.9
}
```

- `capacity`: número positivo de plazas calibradas en la zona visible, no capacidad total inferida del destino.
- Los tres recuentos son enteros no negativos cuya suma debe igualar `capacity`. Una plaza oculta o dudosa pertenece a `unknown`, nunca se presupone libre.
- `capturedAt`: fecha de la imagen original, UTC ISO-8601 con milisegundos. Se rechazan fechas inválidas, no canónicas o futuras. No sustituir por la hora de consulta.
- `confidence`: estimación calibrada entre 0 y 1; `null` cuando no está medida. No equivale automáticamente al score de un detector.
- `parkingId` debe coincidir con el destino solicitado y `sourceId` identificar una fuente no vacía.
- La antigüedad máxima es una opción explícita (`maxAgeMs`), que se decidirá con la frecuencia acordada. Las pruebas usan 120 segundos como ejemplo, no como compromiso del producto.

| Estado | Condición | Presentación |
| --- | --- | --- |
| demo | Fixture explícito sin fuente real | Cifras rotuladas como ejemplo; sin confianza ni fecha inventadas |
| fresh | Lectura válida con edad menor al umbral | Recuentos, plazas sin determinar, confianza y fecha de captura |
| stale | Edad igual o superior al umbral | Oculta recuentos actuales, conserva fecha de última captura |
| unavailable | El proveedor devuelve `null`: sin observación | Guiones, nunca cero plazas |
| error | Respuesta inválida | Guiones y fuente no disponible |

Un futuro proveedor debe convertir timeouts/errores de red en `error`; nunca sustituirlos por datos de demo. La página actual continúa usando exclusivamente la demo y no realiza peticiones externas. Antes de conectar datos reales hay que añadir actualización periódica y expiración en el cliente: una lectura que era reciente al cargar la página no puede permanecer reciente indefinidamente. Mantener sincronizadas las marcas temporales de la imagen y los recuentos, y cubrir fallos de red con pruebas del proveedor.

## Validación

`pnpm test` incluye las pruebas existentes de calculadoras y las del adaptador de parking mediante el runner de Node 24, sin nuevas dependencias. Se cubren caducidad exacta, fechas futuras, recuentos inválidos, plazas desconocidas, confianza ausente, identidad equivocada y distinción entre cero plazas y falta de datos.
