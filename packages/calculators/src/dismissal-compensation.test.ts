import { describe, expect, it } from 'vitest';
import { calculateDismissalCompensation, type DismissalInput } from './dismissal-compensation';

const base: DismissalInput = {
  kind: 'objective', startDate: '2023-01-01', endDate: '2023-12-31', annualGrossSalary: 36_500,
};

describe('Spanish dismissal compensation', () => {
  it('calculates an objective dismissal at 20 salary days per year', () => {
    const result = calculateDismissalCompensation(base);
    expect(result.monthsOfService).toBe(12);
    expect(result.salaryPerDay).toBe(100);
    expect(result.compensation).toBe(2_000);
  });
  it('calculates an unfair dismissal after 2012 at 33 days per year', () => {
    expect(calculateDismissalCompensation({ ...base, kind: 'unfair' }).compensation).toBe(3_300);
  });
  it('rounds any remaining fraction of a month up', () => {
    expect(calculateDismissalCompensation({ ...base, startDate: '2023-01-01', endDate: '2023-02-02' }).monthsOfService).toBe(2);
    expect(calculateDismissalCompensation({ ...base, startDate: '2023-01-01', endDate: '2023-01-01' }).monthsOfService).toBe(1);
  });
  it('applies the 12 and 24 month caps', () => {
    expect(calculateDismissalCompensation({ ...base, startDate: '1980-01-01' }).compensatedDays).toBe(360);
    expect(calculateDismissalCompensation({ ...base, kind: 'unfair', startDate: '2012-02-12', endDate: '2040-12-31' }).compensatedDays).toBe(720);
  });
  it('splits service across 12 February 2012 and keeps a higher pre-2012 cap', () => {
    const split = calculateDismissalCompensation({ ...base, kind: 'unfair', startDate: '2011-02-12', endDate: '2013-02-11' });
    expect(split.before2012Months).toBe(12);
    expect(split.after2012Months).toBe(12);
    expect(split.compensatedDays).toBe(78);
    const long = calculateDismissalCompensation({ ...base, kind: 'unfair', startDate: '1980-01-01', endDate: '2023-12-31' });
    expect(long.capDays).toBe(1260);
    expect(long.compensatedDays).toBe(1260);
    const boundary = calculateDismissalCompensation({ ...base, kind: 'unfair', startDate: '2012-02-11', endDate: '2012-02-12' });
    expect(boundary.before2012Months).toBe(1);
    expect(boundary.after2012Months).toBe(1);
  });
  it('uses 366 days for a leap dismissal year', () => {
    const result = calculateDismissalCompensation({ ...base, endDate: '2024-01-01', annualGrossSalary: 36_600 });
    expect(result.salaryPerDay).toBe(100);
  });
  it('rejects bad dates, reverse chronology and invalid salary', () => {
    expect(() => calculateDismissalCompensation({ ...base, startDate: '2023-02-30' })).toThrow(RangeError);
    expect(() => calculateDismissalCompensation({ ...base, endDate: '2022-12-31' })).toThrow(RangeError);
    expect(() => calculateDismissalCompensation({ ...base, annualGrossSalary: 0 })).toThrow(RangeError);
    expect(() => calculateDismissalCompensation({ ...base, annualGrossSalary: Number.NaN })).toThrow(RangeError);
  });
});
