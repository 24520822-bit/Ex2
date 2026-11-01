# Exercise 2: Pioneer Directory

A small React directory of six scientific pioneers, with case-insensitive name search, an inclusive minimum-IQ filter, descending IQ ordering, deletion, and reset.

## Run locally

Use Node.js 20.19 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Search and IQ filters combine; an empty IQ field shows every remaining person. Delete removes a person for the current session, and **Reset directory** restores the original `SMART_PEOPLE` snapshot.

## Verify

```sh
npm test
npm run build
npm run verify
```

`npm run verify` runs the complete Vitest suite and then creates the production build. The tests cover the normalized scientist schema and stable IDs, search and numeric filtering, immutable IQ sorting, deletion and reset, focus management, live result announcements, and the one-commit search update.

### React DevTools Profiler

To confirm derived results do not trigger a second render:

1. Run `npm run dev` and open the directory in a browser with React Developer Tools installed.
2. In **Profiler**, start recording, type exactly one character into **Search scientists**, then stop recording.
3. Confirm the directory records exactly one committed render for that keystroke. Filtering and IQ sorting are derived during that render rather than updated by an effect.

The automated Profiler regression test in `src/App.test.jsx` checks the same one-commit behavior.
