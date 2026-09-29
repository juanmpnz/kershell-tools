/** Régimen general del Estatuto de los Trabajadores en España, consultado 2026-09-29.
 * Arts. 53.1.b, 56.1 and disposición transitoria 11:
 * https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430
 * Methodology: CGPJ guide to its employment compensation calculator:
 * https://www.poderjudicial.es/stfls/CGPJ/UTILIDADES/guiaCalculadoraIndemnizaciones.pdf
 */
export type DismissalKind = 'objective' | 'unfair';
export interface DismissalInput {
  kind: DismissalKind;
  startDate: string;
  endDate: string;
  /** Gross annual salary in euros including prorated extra payments and regular salary items. */
  annualGrossSalary: number;
}
export interface DismissalResult {
  salaryPerDay: number;
  daysPerYear: number;
  monthsOfService: number;
  before2012Months: number;
  after2012Months: number;
  uncappedDays: number;
  compensatedDays: number;
  capDays: number;
  compensation: number;
}

function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError('Fecha no válida.');
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    throw new RangeError('Fecha no válida.');
  }
  return date;
}

/** Each incomplete calendar month is counted as one month for compensation. Both dates included. */
function serviceMonths(start: Date, end: Date): number {
  if (end < start) return 0;
  return (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    end.getUTCMonth() - start.getUTCMonth() +
    (end.getUTCDate() >= start.getUTCDate() ? 1 : 0);
}

export function calculateDismissalCompensation(input: DismissalInput): DismissalResult {
  if (input.kind !== 'objective' && input.kind !== 'unfair') throw new RangeError('Tipo de despido no válido.');
  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  if (end < start || !Number.isFinite(input.annualGrossSalary) || input.annualGrossSalary <= 0 ||
      input.annualGrossSalary > Number.MAX_SAFE_INTEGER) {
    throw new RangeError('La fecha de cese debe ser posterior al inicio y el salario debe ser positivo.');
  }
  const leap = end.getUTCFullYear() % 4 === 0 &&
    (end.getUTCFullYear() % 100 !== 0 || end.getUTCFullYear() % 400 === 0);
  const salaryPerDay = input.annualGrossSalary / (leap ? 366 : 365);
  const monthsOfService = serviceMonths(start, end);
  const transition = new Date(Date.UTC(2012, 1, 12));
  const before2012Months = input.kind === 'unfair' && start < transition ?
    serviceMonths(start, end < transition ? end : new Date(Date.UTC(2012, 1, 11))) : 0;
  const after2012Months = input.kind === 'unfair' && end >= transition ?
    serviceMonths(start > transition ? start : transition, end) : 0;
  const daysPerYear = input.kind === 'objective' ? 20 : 33;
  const uncappedDays = input.kind === 'objective' ? monthsOfService * 20 / 12 :
    before2012Months * 45 / 12 + after2012Months * 33 / 12;
  const before2012Days = before2012Months * 45 / 12;
  const capDays = input.kind === 'objective' ? 360 :
    before2012Days > 720 ? Math.min(before2012Days, 1260) : 720;
  const compensatedDays = Math.min(uncappedDays, capDays);
  return {
    salaryPerDay, daysPerYear, monthsOfService, before2012Months, after2012Months,
    uncappedDays, compensatedDays, capDays,
    compensation: Math.round((compensatedDays * salaryPerDay + Number.EPSILON) * 100) / 100,
  };
}
