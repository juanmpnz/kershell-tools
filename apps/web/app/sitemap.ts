import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return ['/', '/live', '/rentabilidad-alquiler', '/gastos-compra-vivienda-cataluna', '/indemnizacion-despido'].map((route) => ({ url: new URL(route, base).toString() }));
}
