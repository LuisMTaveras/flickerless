# Changelog

## 0.2.0

### Fixed
- **Web Component**: writes its initial `data-status` / `data-loading`; follows `delay` and `min-duration`
  changes; an empty `error` attribute is an error; children added after mount go into the dimmed body; announces
  the load (`role=status`, `announce-text`) and sets `aria-busy`; keeps one structure when moved in the DOM.
- Mounted with data and an error (a failed reload), values keep showing instead of falling back to «—».
- **No false "empty" on mount.** Mounting with `loading=false` and an empty list is no longer taken as an answer: the
  empty slot and `FlickerlessValue` wait for a finished load (or data already present). Vue, React and React Native.
- **Errors are never swallowed.** Without an `#error` slot / `errorState`, the surface shows `errorText`
  («No se pudo cargar la información.») above the kept content. `errorText=""` turns it off.
- **Vue `:query`** is followed when replaced; a page `{ items | edges | nodes | data | results | rows: [] }` counts as
  empty; `useFlickerlessQuery` exposes `settled`.
- **Packages load in Node** (Nuxt / Next SSR, Vitest): `"type": "module"` and `.js` relative imports in `dist`.
  0.1.0 failed with `Cannot find module …/dist/types`.
- `@flickerless/vue` no longer advertises a `require` entry that pointed to an ES module.

### Changed
- Development uses **pnpm** workspaces (`pnpm install`, `pnpm build`, `pnpm test`).

### Added
- **React parity**: `query` and `preserveHeight` on `FlickerlessSurface`, and `useFlickerlessQuery`.
- **React Native errors**: `renderError` and `errorText` (inline notice; `''` turns it off); `danger` color (optional).
- `isEmptyValue` / `readQueryState` in `@flickerless/core`: one rule for «empty» and «answered» in every adapter.
- Component tests (Vue Test Utils, Testing Library, jsdom) for the surfaces and the Web Component.
- Release workflow: push a `vX.Y.Z` tag and it publishes the four packages with provenance (needs `NPM_TOKEN`).
- `'use client'` in `@flickerless/react`, so it works in the Next.js App Router without a wrapper.
- `files` in every package (only `dist`, README and LICENSE are published) and a LICENSE per package.
- CI: build, typecheck, tests and an SSR smoke test.
