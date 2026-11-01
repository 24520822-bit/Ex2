import { useId, useLayoutEffect, useRef, useState } from 'react';
import { SMART_PEOPLE } from './data/smartPeople.js';
import './App.css';

export default function App() {
  const searchId = useId();
  const minimumIQId = useId();
  const searchInputRef = useRef(null);
  const deleteButtonRefs = useRef(new Map());
  const pendingFocusId = useRef(undefined);
  const [people, setPeople] = useState(() => [...SMART_PEOPLE]);
  const [search, setSearch] = useState('');
  const [minimumIQ, setMinimumIQ] = useState(null);

  const normalizedSearch = search.trim().toLowerCase();
  const results = people
    .filter((person) => person.name.toLowerCase().includes(normalizedSearch))
    .filter((person) => minimumIQ === null || person.iq >= minimumIQ)
    .toSorted((left, right) => right.iq - left.iq);

  useLayoutEffect(() => {
    const focusId = pendingFocusId.current;
    if (focusId === undefined) return;

    pendingFocusId.current = undefined;
    (focusId === null ? searchInputRef.current : deleteButtonRefs.current.get(focusId))
      ?.focus();
  }, [people]);

  const deletePerson = (personId) => {
    const personIndex = results.findIndex((person) => person.id === personId);
    pendingFocusId.current = results[personIndex + 1]?.id ?? results[personIndex - 1]?.id ?? null;
    setPeople((currentPeople) =>
      currentPeople.filter((person) => person.id !== personId));
  };

  return (
    <main className="directory">
      <header className="page-header">
        <p className="eyebrow">Curiosity through the ages</p>
        <h1>Pioneer Directory</h1>
        <p className="intro">Explore the lives and remarkable minds of history's scientific pioneers.</p>
      </header>

      <section className="directory-panel" aria-label="Scientist directory">
        <div className="filters">
          <div className="field">
            <label htmlFor={searchId}>Search scientists</label>
            <input
              id={searchId}
              ref={searchInputRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Try a name"
            />
          </div>
          <div className="field">
            <label htmlFor={minimumIQId}>Minimum IQ</label>
            <input
              id={minimumIQId}
              type="number"
              min="0"
              value={minimumIQ ?? ''}
              onChange={(event) => {
                const value = event.currentTarget.valueAsNumber;
                setMinimumIQ(Number.isNaN(value) ? null : value);
              }}
              placeholder="Any score"
            />
          </div>
        </div>

        <div className="results-toolbar">
          <output className="result-count" role="status" aria-live="polite">
            {results.length} {results.length === 1 ? 'scientist' : 'scientists'}
          </output>
          <button className="reset-button" type="button" onClick={() => setPeople([...SMART_PEOPLE])}>
            Reset directory
          </button>
        </div>

        <ul className="people-list" aria-label="Scientists">
          {results.map((person) => (
            <li className="person-card" key={person.id}>
              <article>
                <h2>{person.name}</h2>
                <p>Age {person.age}</p>
                <p className="iq-score">IQ {person.iq}</p>
                <button
                  className="delete-button"
                  type="button"
                  ref={(element) => {
                    if (element) deleteButtonRefs.current.set(person.id, element);
                    else deleteButtonRefs.current.delete(person.id);
                  }}
                  onClick={() => deletePerson(person.id)}
                  aria-label={`Delete ${person.name}`}
                >
                  Delete
                </button>
              </article>
            </li>
          ))}
        </ul>
        {results.length === 0 && <p className="empty-state">No scientists match these filters.</p>}
      </section>
    </main>
  );
}
