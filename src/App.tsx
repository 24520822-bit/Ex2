import { useId, useLayoutEffect, useRef, useState } from "react";
import { deriveVisiblePeople, type SortBy } from "./directory";
import { SMART_PEOPLE, type Person } from "./smartPeople";

function initials(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function App() {
  const searchId = useId();
  const iqId = useId();
  const sortId = useId();
  const [people, setPeople] = useState<Person[]>(() => [...SMART_PEOPLE]);
  const [search, setSearch] = useState("");
  const [minimumIq, setMinimumIq] = useState(Number.NaN);
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusId = useRef<string | null>(null);

  const visiblePeople = deriveVisiblePeople(people, search, minimumIq, sortBy);

  useLayoutEffect(() => {
    const focusId = pendingFocusId.current;
    if (focusId === null) return;

    pendingFocusId.current = null;
    const target = deleteButtonRefs.current.get(focusId);
    (target ?? resetButtonRef.current)?.focus();
  }, [people]);

  function deletePerson(personId: string) {
    const deletedIndex = people.findIndex((person) => person.id === personId);
    const nextPerson = people[deletedIndex + 1] ?? people[deletedIndex - 1];
    pendingFocusId.current = nextPerson?.id ?? "";
    setPeople((currentPeople) => currentPeople.filter((person) => person.id !== personId));
  }

  function resetDirectory() {
    pendingFocusId.current = null;
    setPeople([...SMART_PEOPLE]);
    setSearch("");
    setMinimumIq(Number.NaN);
    setSortBy("default");
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Curious Minds home">
          <span className="wordmark-icon" aria-hidden="true">C</span>
          <span>curious minds</span>
        </a>
        <span className="topbar-note">A living index of remarkable minds</span>
      </header>

      <section className="hero" id="top" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-rule" /> The people behind the ideas</p>
          <h1 id="page-title">Big ideas<br />begin with <em>curiosity.</em></h1>
          <p className="hero-description">
            Meet the scientists, thinkers, and pioneers whose questions changed how we see the world.
          </p>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <span>Explore</span>
          <span>the minds</span>
          <span>that move us <b>↘</b></span>
        </div>
        <div className="hero-index" aria-hidden="true">FIELD NOTES&nbsp; / &nbsp;NO. 002</div>
      </section>

      <section className="directory" aria-labelledby="directory-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The directory</p>
            <h2 id="directory-heading">Curious by nature.</h2>
          </div>
          <p className="section-intro">A few of history’s most original thinkers,<br />all in one place.</p>
        </div>

        <div aria-label="Directory controls" className="toolbar" role="group">
          <div className="search-control">
            <label htmlFor={searchId}>Search by name</label>
            <div className="input-wrap search-wrap">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                autoComplete="off"
                id={searchId}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try “Marie Curie”"
                type="search"
                value={search}
              />
            </div>
          </div>
          <div className="filter-control">
            <label htmlFor={iqId}>Minimum IQ</label>
            <div className="input-wrap">
              <input
                id={iqId}
                max="300"
                min="0"
                onChange={(event) => setMinimumIq(event.target.valueAsNumber)}
                placeholder="Any"
                type="number"
                value={Number.isFinite(minimumIq) ? minimumIq : ""}
              />
              <span className="input-suffix">IQ</span>
            </div>
          </div>
          <div className="sort-control">
            <label htmlFor={sortId}>Sort by</label>
            <div className="input-wrap">
              <select id={sortId} onChange={(event) => setSortBy(event.target.value as SortBy)} value={sortBy}>
                <option value="default">Featured</option>
                <option value="iq">IQ · low to high</option>
                <option value="age">Age · low to high</option>
              </select>
              <span className="select-chevron" aria-hidden="true">⌄</span>
            </div>
          </div>
          <button
            aria-label="Reset directory"
            className="reset-button"
            onClick={resetDirectory}
            ref={resetButtonRef}
            type="button"
          >
            <span aria-hidden="true">↺</span> Reset
          </button>
        </div>

        <div className="results-heading">
          <p aria-live="polite" role="status">
            <strong>{visiblePeople.length}</strong> {visiblePeople.length === 1 ? "person" : "people"}
            <span> in the directory</span>
          </p>
          <span className="results-sort-note">
            {sortBy === "default" ? "A selection of brilliant minds" : `Ordered by ${sortBy}`}
          </span>
        </div>

        {visiblePeople.length > 0 ? (
          <div className="people-grid">
            {visiblePeople.map((person, index) => (
              <article aria-label={person.name} className="person-card" key={person.id}>
                <div className="card-topline">
                  <span className={`portrait portrait-${index % 6}`} aria-hidden="true">
                    {initials(person.name)}
                  </span>
                  <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                  <button
                    aria-label={`Delete ${person.name}`}
                    className="delete-button"
                    onClick={() => deletePerson(person.id)}
                    ref={(element) => {
                      if (element) deleteButtonRefs.current.set(person.id, element);
                      else deleteButtonRefs.current.delete(person.id);
                    }}
                    title={`Remove ${person.name}`}
                    type="button"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <h3>{person.name}</h3>
                <p className="person-role">Scientist <span>·</span> Pioneer</p>
                <div className="card-divider" />
                <div className="person-stats">
                  <div><span>Age</span><strong>{person.age}</strong></div>
                  <div><span>Est. IQ</span><strong>{person.iq}</strong></div>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">◎</span>
            <h3>No minds found</h3>
            <p>Try a different name or lower the IQ threshold.</p>
            <button aria-label="Restore original directory" onClick={resetDirectory} type="button">
              Reset directory
            </button>
          </div>
        )}

        <p className="data-note">
          IQ figures are illustrative estimates for this exercise, not verified historical measurements.
        </p>
      </section>

      <footer className="footer">
        <span>Curious Minds <span className="footer-dot">●</span> Exercise 02</span>
        <span>Stay curious. Keep asking.</span>
      </footer>
    </main>
  );
}

export default App;
