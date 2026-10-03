import type { Availability, DemoAvailability } from '@/lib/parking/availability';

const statusLabels = {
  demo: 'Sin conectar', fresh: 'Lectura reciente', stale: 'Lectura antigua',
  unavailable: 'Sin datos', error: 'Fuente no disponible',
};

export function ParkingAvailability({ name, availability }: { name: string; availability: Availability | DemoAvailability }) {
  const { status, snapshot } = availability;
  const isDemo = status === 'demo';
  const visible = status === 'fresh' || isDemo ? snapshot : null;
  const suffix = isDemo ? ' · ejemplo' : '';
  const occupancy = visible ? Math.round(visible.occupied / visible.capacity * 100) : null;
  const capturedAt = snapshot?.capturedAt;
  const confidence = visible?.confidence;

  return (
    <article className="result-panel parking-summary" aria-labelledby="availability-heading">
      <p className="eyebrow">{isDemo ? 'DATOS SIMULADOS' : 'DISPONIBILIDAD ESTIMADA'}</p>
      <h3 id="availability-heading">{name}</h3>
      <p className="result-label">Plazas disponibles{suffix}</p>
      <div className="hero-number">{visible ? visible.available : '—'}{visible && <span>/{visible.capacity}</span>}</div>
      {visible ? <>
        <p className="result-caption">{occupancy}% de ocupación {isDemo ? 'en este escenario ilustrativo.' : 'en la zona medida.'}</p>
        <meter className="parking-meter" min={0} max={visible.capacity} value={visible.occupied} aria-label={`${visible.occupied} de ${visible.capacity} plazas ocupadas${suffix}`}>{occupancy}%</meter>
      </> : <p className="result-caption">{status === 'stale' ? 'La última lectura ha caducado. Esperamos una nueva captura para mostrar plazas disponibles.' : 'No hay una lectura válida. La ausencia de datos no significa que el parking esté lleno.'}</p>}
      <div className="result-divider" />
      <dl className="result-list">
        <div><dt>Ocupadas{suffix}</dt><dd>{visible?.occupied ?? '—'}</dd></div>
        <div><dt>Disponibles{suffix}</dt><dd>{visible?.available ?? '—'}</dd></div>
        <div><dt>Sin determinar{suffix}</dt><dd>{visible?.unknown ?? '—'}</dd></div>
        <div><dt>Estado de conexión</dt><dd><span role="status">{statusLabels[status]}</span></dd></div>
        <div><dt>Confianza de detección</dt><dd>{confidence == null ? 'Sin medir' : `${Math.round(confidence * 100)}%`}</dd></div>
        <div><dt>Última captura</dt><dd>{capturedAt ? <time dateTime={capturedAt}>{new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Europe/Paris' }).format(new Date(capturedAt))} (París)</time> : 'Sin datos reales'}</dd></div>
      </dl>
    </article>
  );
}
