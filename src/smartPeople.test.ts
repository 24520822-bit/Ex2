import { describe, expect, it } from "vitest";
import { SMART_PEOPLE } from "./smartPeople";

describe("SMART_PEOPLE", () => {
  it("uses a unique stable ID and the required fields for every person", () => {
    const ids = SMART_PEOPLE.map(({ id }) => id);

    expect(new Set(ids).size).toBe(SMART_PEOPLE.length);
    expect(SMART_PEOPLE.every(({ id, name, age, iq }) =>
      id.length > 0 && name.length > 0 && Number.isFinite(age) && Number.isFinite(iq),
    )).toBe(true);
    expect(SMART_PEOPLE.some(({ name }) => name === "Johann Goethe")).toBe(true);
  });
});
