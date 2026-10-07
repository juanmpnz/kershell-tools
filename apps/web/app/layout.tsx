import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Kershell Tools | Herramientas para decidir mejor', template: '%s | Kershell Tools' },
  description: 'Calculadoras claras para tomar decisiones sobre vivienda.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <a className="brand" href="/" aria-label="Kershell Tools, inicio"><span className="brand-mark">K</span><span>Kershell <strong>Tools</strong></span></a>
          <span className="header-note">Herramientas para decidir mejor</span>
        </header>
        <main>{children}</main>
        <footer className="site-footer"><span>© {new Date().getFullYear()} Kershell</span><span>Estimaciones orientativas. Comprueba los datos antes de decidir.</span></footer>
      </body>
    </html>
  );
}
