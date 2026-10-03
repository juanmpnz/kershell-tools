# Parking Live: webcam propia y análisis local

## Cambio de producto: webcam propia (3 de octubre de 2026)

La ruta pública ahora ofrece una herramienta genérica, sin catálogo de destinos ni dependencia de Les Angles. El usuario confirmó mapear manualmente las cuatro esquinas de cada plaza una sola vez. La URL y los polígonos normalizados se guardan bajo `kershell.parking.camera.v1` en localStorage. Se valida el guardado al recuperarlo; los resultados de detección no persisten. Solo se guarda una cámara por navegador en esta versión. Cambiar URL o tipo de fuente empieza un mapa nuevo; «Olvidar cámara» elimina únicamente esta clave.

### Recorrido y ejecución

1. Elegir imagen, vídeo directo o HLS y guardar una URL pública HTTPS.
2. Cargar la fuente en el navegador. No hay proxy que consulte URLs arbitrarias desde el servidor.
3. Marcar cuadriláteros convexos (máximo 100) con ratón/táctil o flechas + Enter. Eliminar plazas individualmente si hace falta.
4. Iniciar la detección. COCO-SSD (`lite_mobilenet_v2`) se descarga bajo demanda y usa TensorFlow.js WebGL, con CPU como alternativa. HLS usa HLS.js cuando el navegador lo permite y reproducción nativa como alternativa.
5. Mostrar ocupadas, libres estimadas y desconocidas. La webcam y el mapa se recuperan al volver; el análisis se inicia explícitamente, para no cargar el modelo ni consumir GPU automáticamente.

Cada vehículo se vincula a una plaza si su punto de apoyo aproximado (centro horizontal, 80% de altura de su caja) cae en el polígono. Una detección ≥0,6 marca ocupación; entre 0,3 y 0,6 deja la plaza sin determinar. Ausencia de vehículo implica libre estimada, **no una garantía de vacío**. Estos umbrales son heurísticos y no confianza calibrada de ocupación. No se implementa identidad persistente de vehículos ni reconocimiento automático de líneas. No es un detector entrenado específicamente para cámaras de parking.

La inferencia se ejecuta secuencialmente cada tres segundos; imágenes se solicitan cada 60 segundos. Una fuente de imágenes podría publicar capturas menos frecuentes o congeladas: la UI distingue hora de análisis local de antigüedad de captura, que se declara desconocida. Vídeo pausado/finalizado/sin avance deja las plazas sin determinar. Al ocultar la pestaña se ocultan resultados y se pausa el análisis. Cambiar fuente, editar mapa o detener invalida resultados pendientes.

### Límites comprobados

- [Glen Alps, Alaska](https://dnr.alaska.gov/parks/units/chugach/glenalpswebcam.htm) declara refresco de cinco minutos. Su [JPEG directo](https://dnr.alaska.gov/parks/units/chugach/glenalpscam/current2.jpg) devuelve HTTP 200 y se pudo visualizar en la app, pero bloquea lectura de píxeles cross-origin. Se muestra como **solo consulta**, con el seguimiento deshabilitado.
- Se usa como prueba técnica de inferencia una imagen estática de vehículo del [repositorio de Ultralytics](https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/assets/bus.jpg), que responde con CORS permitido. No es una webcam ni se incluye como fuente predeterminada del producto.
- URLs de páginas, YouTube, iframes y RTSP no son entradas compatibles. No se intenta extraer streams ni eludir bloqueos del proveedor. Una URL pública no implica compatibilidad de análisis.
- El modelo carga pesos desde la ubicación distribuida por TensorFlow; el proveedor de vídeo recibe las peticiones de reproducción normales. Las imágenes no se envían a Kershell ni a una API de inferencia.
- La compatibilidad con una fuente no acredita permiso de reutilización; el producto pide usar fuentes que el usuario tenga derecho a utilizar.

Referencias técnicas: [COCO-SSD oficial](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd), [HLS.js oficial](https://github.com/video-dev/hls.js). Dependencias fijadas a versiones exactas, instaladas sin ejecutar scripts y revisadas con `pnpm audit --prod`.

El contrato y monitor de las fases anteriores siguen siendo código probado para una futura integración de proveedor, pero ya no gobiernan la ruta pública ni implican que exista un endpoint activo.


## Validaciones de esta entrega

- 48 tests: 19 de calculadoras y 29 de parking (contrato anterior, caducidad y configuración/geometría nuevas).
- `pnpm typecheck`, `pnpm build` y `pnpm audit --prod`: correctos; sin vulnerabilidades conocidas notificadas.
- Navegador: carga de Glen Alps como solo consulta; dibujo de un polígono sobre imagen técnica; detección de un vehículo como ocupado; recarga conserva URL y polígono pero no resultados; reproducción del [HLS de prueba oficial](https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8); URL inexistente muestra error; olvidar cámara persiste tras recarga.
- Revisión a 320 y 1440 px sin desbordamiento horizontal. La configuración de prueba se eliminó al terminar.

## Siguiente paso técnico

Validar con varias cámaras fijas de parkings reales que permitan lectura de píxeles: medir falsos libres/ocupados, ajustar el punto de apoyo y umbrales, y añadir estabilidad temporal. La prueba técnica confirma que el recorrido de inferencia funciona, no su precisión en cualquier parking. Antes de publicación, comprobar rendimiento en móviles y el consumo del modelo. Para fuentes con CORS bloqueado haría falta integración específica o una fuente alternativa; no introducir un proxy abierto de URLs.
