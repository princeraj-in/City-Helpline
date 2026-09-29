import { describe, it, expect } from 'vitest';
import { getCityBenchmark, DEFAULT_BENCHMARK } from '../src/lib/budgetBenchmarks';

describe('Budget Benchmarks Service (budgetBenchmarks)', () => {
  it('should return Kota budget benchmark with realistic figures', () => {
    const kota = getCityBenchmark('Kota');
    expect(kota).toBeDefined();
    expect(kota.city).toBe('Kota');
    expect(kota.avgTotalMonthly).toBeGreaterThan(0);
    expect(kota.rentRanges.singleNonAC).toBeGreaterThan(0);
    expect(kota.messRanges.fullMess3Meals).toBeGreaterThan(0);
  });

  it('should return Nawada benchmark with tier-2 student pricing', () => {
    const nawada = getCityBenchmark('Nawada');
    expect(nawada).toBeDefined();
    expect(nawada.city).toBe('Nawada');
    expect(nawada.tier).toBe('tier2');
    expect(nawada.rentRanges.singleNonAC).toBeLessThanOrEqual(5000);
  });

  it('should gracefully fallback to default benchmark for unknown cities', () => {
    const unknown = getCityBenchmark('UnknownTown123');
    expect(unknown).toBeDefined();
    expect(unknown.city).toBe('UnknownTown123');
    expect(unknown.avgTotalMonthly).toBe(DEFAULT_BENCHMARK.avgTotalMonthly);
  });
});
