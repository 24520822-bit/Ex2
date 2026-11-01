import { describe, expect, it } from 'vitest';
import { SMART_PEOPLE } from './smartPeople.js';

describe('SMART_PEOPLE', () => {
  it('identifies Johann Goethe with a stable ID and exercise values', () => {
    expect(SMART_PEOPLE[0]).toEqual({
      id: 'johann-goethe',
      name: 'Johann Goethe',
      age: 82,
      iq: 210,
    });
  });

  it('keeps a unique, stable ID for every scientist', () => {
    expect(SMART_PEOPLE.map(({ id }) => id)).toEqual([
      'johann-goethe',
      'albert-einstein',
      'leonardo-da-vinci',
      'isaac-newton',
      'james-maxwell',
      'william-sidis',
    ]);
    expect(new Set(SMART_PEOPLE.map(({ id }) => id)).size).toBe(SMART_PEOPLE.length);
  });

  it('uses the normalized schema and immutable data snapshot', () => {
    expect(Object.isFrozen(SMART_PEOPLE)).toBe(true);

    for (const person of SMART_PEOPLE) {
      expect(Object.keys(person).sort()).toEqual(['age', 'id', 'iq', 'name']);
      expect(Object.isFrozen(person)).toBe(true);
      expect(person.id).toEqual(expect.any(String));
      expect(person.name).toEqual(expect.any(String));
      expect(Number.isInteger(person.age)).toBe(true);
      expect(Number.isInteger(person.iq)).toBe(true);
    }
  });
});
