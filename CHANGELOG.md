# Changelog

## 0.2.0

### Fixed
- **No false "empty" on mount.** Mounting with `loading=false` and an empty list is no longer taken as an answer: the
  empty slot and `FlickerlessValue` wait for a finished load (or data already present). Vue, React and React Native.
- **Errors are never swallowed.** Without an `#error` slot / `errorState`, the surface shows `errorText`
  («No se pudo cargar la información.») above the kept content. `errorText=""` turns it off.
- **Vue `:query`** is followed when replaced; a page `{ items | edges | nodes | data | results | rows: [] }` counts as
  empty; `useFlickerlessQuery` exposes `settled`.
- **Packages load in Node** (Nuxt / Next SSR, Vitest): `"type": "module"` and `.js` relative imports in `dist`.
  0.1.0 failed with `Cannot find module …/dist/types`.
- `@flickerless/vue` no longer advertises a `require` entry that pointed to an ES module.

### Added
- `'use client'` in `@flickerless/react`, so it works in the Next.js App Router without a wrapper.
- `files` in every package (only `dist`, README and LICENSE are published) and a LICENSE per package.
- CI: build, typecheck, tests and an SSR smoke test.
