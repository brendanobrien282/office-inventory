# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Both `client/` and `server/` are independent packages — run all commands from within their respective directories.

**Server** (`cd server`):
```bash
npm run dev      # start Express API on http://localhost:3001
npm test         # run all backend tests (Jest)
npx jest -t "pattern"  # run a single test by name pattern
```

**Client** (`cd client`):
```bash
npm run dev      # start Vite dev server on http://localhost:5173
npm test         # run all frontend tests (Vitest)
npx vitest run -t "pattern"  # run a single test by name pattern
```

Both servers must be running simultaneously for the app to work. The Vite dev server proxies `/api` requests to `http://localhost:3001`.

## Architecture

Single repo, two independent packages: `client/` (Vite + React) and `server/` (Node + Express + better-sqlite3).

### Backend

- `server/server.js` — exports `createApp(db)` factory; when run directly, instantiates the real DB and starts listening. This split is what makes tests work without side effects.
- `server/db.js` — creates the `better-sqlite3` connection to `server/db/inventory.db` and runs `CREATE TABLE IF NOT EXISTS` on load. The `server/db/` directory is gitignored.
- `server/routes/items.js` — exports `makeItemsRouter(db)`. Takes the DB as a parameter so tests can inject an in-memory instance.

**Test pattern (backend):** Tests in `server/__tests__/` create a fresh `new Database(':memory:')`, run the schema SQL, call `createApp(db)`, and exercise endpoints via `supertest`. Each test gets an isolated in-memory DB — no mocking.

### Frontend

- `client/src/api.js` — all `fetch` calls live here. Functions correspond 1:1 to API endpoints.
- `client/src/App.jsx` — owns the `items` state array. Calls `fetchItems()` (full re-fetch from API) after every mutation.
- `client/src/components/` — `ItemList.jsx` renders the table; `AddItemForm.jsx` owns form state and frontend validation.

**Test pattern (frontend):** Tests use React Testing Library + Vitest. `AddItemForm` tests render the component and assert on what the `onAdd` callback receives and what error messages appear. Vitest globals are enabled (`globals: true` in `vite.config.js`); `@testing-library/jest-dom` matchers are available everywhere via `src/test-setup.js`.

### API contract

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/items` | Return all items |
| POST | `/api/items` | Create item; returns 201 + created row |
| PUT | `/api/items/:id` | Full item update (name, quantity, unit) |
| DELETE | `/api/items/:id` | Delete item; returns 404 if not found |

### Schema

```sql
items (id INTEGER PK, name TEXT NOT NULL, quantity INTEGER NOT NULL, unit TEXT)
```

## Key constraints

- Frontend validation only (no backend validation layer) — block empty name and non-positive quantity before the request fires.
- No routing, no modals — everything on one page, single `useState` for the item list.
- `server/db/inventory.db` is gitignored. The file is created automatically on first server start.
- `better-sqlite3` v11+ is required — earlier versions lack prebuilt binaries for Node 22.
