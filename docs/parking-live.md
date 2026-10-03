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

Un futuro proveedor debe convertir timeouts/errores de red en `error`; nunca sustituirlos por datos de demo. La página actual continúa usando exclusivamente la demo y no realiza peticiones externas. La actualización periódica y la expiración del cliente ya están implementadas; antes de activar el modo real falta conectar y probar el endpoint con la fuente autorizada. Mantener sincronizadas las marcas temporales de la imagen y los recuentos, y cubrir fallos de red con pruebas del proveedor.

## Validación

`pnpm test` incluye las pruebas existentes de calculadoras y las del adaptador de parking mediante el runner de Node 24, sin nuevas dependencias. Se cubren caducidad exacta, fechas futuras, recuentos inválidos, plazas desconocidas, confianza ausente, identidad equivocada y distinción entre cero plazas y falta de datos.


## Comprobación visual de Bas de station — 3 de octubre de 2026

Se abrió la cámara mediante el botón oficial «Bas de station». En el encuadre observado aparecen el edificio de la estación, una rotonda y accesos, sin un conjunto suficiente de plazas delimitadas que permita validar un contador de disponibilidad. Esto describe solamente la imagen inspeccionada: no demuestra que todos los encuadres del proveedor sean iguales ni que ninguna otra cámara sirva. La fuente continúa sin aprobarse para el piloto. No se descargaron imágenes ni se activó captura periódica.

## Actualización del cliente

`ParkingLiveAvailability` separa explícitamente `mode: 'demo'` de `mode: 'live'`. La ruta pública sigue en demo y no inicia peticiones ni temporizadores. En modo live, el cliente espera un endpoint de nuestra propia aplicación: `/api/live/parking/{parkingId}`. Ese endpoint todavía no existe; no activar el modo live hasta implementar el proveedor autorizado. No se expone una URL configurable de terceros al navegador.

`watchParking` aplica estas reglas, con pruebas de reloj controlado:

- Una petición activa por monitor; siguiente consulta después de completarse la anterior.
- Timeout configurable con cancelación; respuestas tardías no cambian el estado.
- Caducidad independiente de la red: el contador desaparece al alcanzar la edad máxima, aunque la siguiente consulta siga pendiente.
- Error de red o respuesta inválida: no muestra cifras anteriores ni introduce números de demo.
- Al desmontar o esconder la pestaña, cancela la consulta y los temporizadores. Al volver a la pestaña consulta de nuevo, sin presentar el valor anterior como reciente.
- Las consultas usan `cache: 'no-store'` y el futuro endpoint deberá responder también sin caché. Los tiempos se decidirán con el proveedor; no hay valores productivos fijados.

Para integrar: implementar el endpoint con acceso de servidor a la fuente aprobada, límites de tiempo y respuestas del contrato v1; probar el modo live de extremo a extremo (incluidos timeout y recuperación); después cambiar la configuración de la página y su copy de demostración. La mera existencia del monitor no habilita datos reales.
