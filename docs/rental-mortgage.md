# Alquiler con hipoteca

Ámbito: compra para alquilar en España, EUR, primer año completo, antes de impuestos. Ruta `/alquiler-con-hipoteca`. Fuentes consultadas el 07-10-2026:

- [Banco de España: préstamo hipotecario](https://clientebancario.bde.es/pcb/es/menu-horizontal/podemosayudarte/simuladores/simulador_prestamo_hipotecario_personal.html): sistema francés, cuotas mensuales iguales con interés constante.
- [Banco de España: hipótesis de cálculo](https://clientebancario.bde.es/pcb/es/menu-horizontal/podemosayudarte/simuladores/calculo-de-la-tae-de-un-prestamo-hipotecario.html): intereses mensuales = capital pendiente × TIN / 1200, sin carencia y primer pago un mes después del origen. Nuestra herramienta no calcula TAE.

## Método

Préstamo = precio − entrada. Gastos iniciales totalmente pagados con dinero propio. Aportación inicial = entrada + gastos iniciales. Cuota = P i / (1 − (1+i)^(-n)); con TIN cero, P/n. Se usa expm1/log1p para estabilidad con tasas pequeñas. Intereses y capital se simulan en los primeros 12 pagos sin redondear resultados intermedios; la presentación redondea a céntimos.

Ingresos = alquiler × (12 − meses vacíos). Efectivo anual = ingresos − gastos − 12 cuotas. Media mensual = efectivo /12. El efectivo en un mes ocupado/vacío prorratea los gastos anuales; no es un calendario de tesorería. Renta de equilibrio = (gastos + 12 cuotas) / meses ocupados; no calculable con 12 meses vacíos. Retorno de efectivo = efectivo / aportación inicial ×100; no calculable con aportación cero. El capital amortizado ya está descontado en las cuotas y se muestra separadamente como reducción de deuda, nunca como efectivo disponible.

## Límites y mantenimiento

TIN proporcionado por usuario (0–100 %), plazo de años enteros (1–50), dinero no negativo hasta 10^12 EUR y entrada <= precio. Rango técnico de la herramienta, no criterios de aprobación bancaria. Admite compra al contado, TIN cero, financiación del 100 % del precio y fracciones de meses vacíos. Los valores iniciales son ilustrativos y no cotizaciones de mercado.

No IRPF, TAE, revalorización, venta, variación futura de interés, carencia ni amortizaciones anticipadas. Reformas y gastos de financiación iniciales se añaden manualmente. Seguros y comisiones recurrentes se incluyen en los campos de gastos; no hay doble descuento automático. Gastos recurrentes constantes durante meses vacíos. Una hipoteca existente requiere otro modelo para los intereses y el capital del primer año restante.

Revisar fuentes trimestralmente (próxima revisión 07-01-2027), o ante cambios del método/documentación oficial. Cualquier ampliación fiscal requiere normativa propia vigente, supuestos y tests. Los datos permanecen en memoria del navegador, sin almacenamiento, parámetros URL ni trackers.

## Validación

Tests con cuota de referencia de préstamo de 160.000 EUR, TIN 3 %, 25 años (758,7381022 EUR); separación interés/capital y deuda; equilibrio anual; vacío completo y parcial; compra al contado; aportación cero; TIN cero y próximo a cero; amortización completa en un año; entradas inválidas. Ejecutar typecheck, tests y build del monorepo.
