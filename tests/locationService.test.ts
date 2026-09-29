import { describe, it, expect } from 'vitest';
import { findClosestCity, normalizeCityName, calculateDistanceKm } from '../src/lib/locationService';

describe('Location Service (locationService)', () => {
  it('should find closest city for Kota coordinates (25.18, 75.83)', () => {
    const result = findClosestCity(25.18, 75.83);
    expect(result.city).toBe('Kota');
    expect(result.state).toBe('Rajasthan');
    expect(result.distanceKm).toBeLessThanOrEqual(5);
  });

  it('should find closest city for Patna coordinates (25.5941, 85.1376)', () => {
    const result = findClosestCity(25.5941, 85.1376);
    expect(result.city).toBe('Patna');
    expect(result.state).toBe('Bihar');
  });

  it('should normalize city names correctly', () => {
    expect(normalizeCityName('new delhi')).toBe('New Delhi');
    expect(normalizeCityName('patna')).toBe('Patna');
    expect(normalizeCityName('KOTA')).toBe('Kota');
  });

  it('should calculate distance accurately between two GPS points', () => {
    // Distance between Delhi and Jaipur is approx 240-270km
    const dist = calculateDistanceKm(28.6139, 77.2090, 26.9124, 75.7873);
    expect(dist).toBeGreaterThan(200);
    expect(dist).toBeLessThan(300);
  });
});
