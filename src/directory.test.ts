import { describe, expect, it } from "vitest";
import { SMART_PEOPLE } from "./smartPeople";
import { deriveVisiblePeople } from "./directory";

describe("deriveVisiblePeople", () => {
  it("searches names without case sensitivity", () => {
    const results = deriveVisiblePeople(SMART_PEOPLE, "EINSTEIN", Number.NaN, "default");

    expect(results.map(({ name }) => name)).toEqual(["Albert Einstein"]);
  });

  it("filters by a minimum IQ and supports a numeric zero threshold", () => {
    const results = deriveVisiblePeople(SMART_PEOPLE, "", 150, "default");

    expect(results.every(({ iq }) => iq >= 150)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(deriveVisiblePeople(SMART_PEOPLE, "", 0, "default")).toHaveLength(SMART_PEOPLE.length);
  });

  it("sorts by IQ or age without mutating the source array", () => {
    const originalOrder = SMART_PEOPLE.map(({ id }) => id);
    const byIq = deriveVisiblePeople(SMART_PEOPLE, "", Number.NaN, "iq");
    const byAge = deriveVisiblePeople(SMART_PEOPLE, "", Number.NaN, "age");

    expect(byIq.map(({ iq }) => iq)).toEqual([...byIq.map(({ iq }) => iq)].sort((a, b) => a - b));
    expect(byAge.map(({ age }) => age)).toEqual([...byAge.map(({ age }) => age)].sort((a, b) => a - b));
    expect(SMART_PEOPLE.map(({ id }) => id)).toEqual(originalOrder);
  });
});
