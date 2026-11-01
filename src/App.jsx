import { useId, useState } from 'react';
import { SMART_PEOPLE } from './data/smartPeople.js';
import './App.css';

export default function App() {
  const searchId = useId();
  const minimumIQId = useId();
  const [search, setSearch] = useState('');
  const [minimumIQ, setMinimumIQ] = useState(null);

  const normalizedSearch = search.trim().toLowerCase();
  const results = SMART_PEOPLE
    .filter((person) => person.name.toLowerCase().includes(normalizedSearch))
    .filter((person) => minimumIQ === null || person.iq >= minimumIQ)
    .toSorted((left, right) => right.iq - left.iq);

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

        <ul className="people-list" aria-label="Scientists">
          {results.map((person) => (
            <li className="person-card" key={person.id}>
              <article>
                <h2>{person.name}</h2>
                <p>Age {person.age}</p>
                <p className="iq-score">IQ {person.iq}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
