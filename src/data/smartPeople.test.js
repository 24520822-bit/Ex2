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
});
