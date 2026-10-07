import Link from 'next/link';

type CalculatorHeaderProps = { title: string; description: string };

export function CalculatorHeader({ title, description }: CalculatorHeaderProps) {
  return <header className="calculator-header">
    <Link href="/" className="calculator-back">← Todas las herramientas</Link>
    <h1>{title}</h1>
    <p>{description}</p>
  </header>;
}
