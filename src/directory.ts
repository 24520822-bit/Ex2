import type { Person } from "./smartPeople";

export type SortBy = "default" | "iq" | "age";

export function deriveVisiblePeople(
  people: readonly Person[],
  search: string,
  minimumIq: number,
  sortBy: SortBy,
): Person[] {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const matches = people.filter((person) => {
    const matchesName = person.name.toLocaleLowerCase().includes(normalizedSearch);
    const matchesIq = !Number.isFinite(minimumIq) || person.iq >= minimumIq;

    return matchesName && matchesIq;
  });

  if (sortBy === "iq") {
    return matches.toSorted((first, second) => first.iq - second.iq);
  }

  if (sortBy === "age") {
    return matches.toSorted((first, second) => first.age - second.age);
  }

  return matches;
}
