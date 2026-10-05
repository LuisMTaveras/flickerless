# ⚡ Flickerless

> **The calm, layout-stable alternative to skeleton fatigue for data tables, lists, and dashboards.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Zero CLS](https://img.shields.io/badge/CLS-0.00-brightgreen.svg)](https://web.dev/cls/)
[![Bundle Size](https://img.shields.io/badge/Bundle-<2KB-success.svg)](https://bundlephobia.com)

---

## 🧐 The Problem with Skeletons in Data Tables

Skeleton screens were invented in 2014 for **social media feeds** (large individual photo cards). When applied to dense data tables (invoicing, billing, CRM, ERPs), they introduce critical UX issues:

1. **Skeleton Fatigue & Micro-Flicker:** If your API responds in 150–300 ms, the table collapses into gray sausage pills and flashes back to real rows, causing severe eye strain.
2. **The "Zero Results" Deception:** The user filters by a category, sees 5 fake skeleton rows pulsating for 500ms, only to be slapped with *"0 records found"*.
3. **High Maintenance Debt:** Every time you add, reorder, or resize a column, you must manually update your skeleton widths to prevent layout misalignment.
4. **Mobile Breakdown:** A rigid table skeleton breaks when responsive layouts collapse into mobile cards.

---

## ✨ The Flickerless Solution

```
┌────────────────────────────────────────────────────────┐
│ [ ]  FACTURA     CLIENTE       TOTAL      ESTADO       │
├════════════════════════════════════════════════════════┤ <── 2px Glide Stream (Active)
│      FAC-001     Acme Corp     $1,200     Emitida      │
│      FAC-002     Stripe Inc    $4,500     Emitida      │ <── Rows remain visible at 50% opacity
│      FAC-003     Linear Inc      $890     Borrador     │     (Zero jump, zero scroll lost)
└────────────────────────────────────────────────────────┘
```

* **Anti-Flicker Threshold (180ms):** If your API resolves quickly, no loader is ever shown. Zero unnecessary flashes.
* **Keep Previous Data:** Filtering, searching, or paginating keeps previous rows on screen at attenuated opacity (`50%`). The user never loses visual context.
* **Responsive Surface:** Works whether your content is an enterprise `<table>`, CSS Grid, or mobile cards.
* **Zero Maintenance:** One universal wrapper for all tables in your app. Never code individual skeleton columns again.

---

## 📦 Packages

| Package | Description | Size |
| :--- | :--- | :--- |
| [`@flickerless/core`](./packages/core) | Engine, Web Component (`<flickerless-surface>`), and CSS | ~1.8 KB |
| [`@flickerless/react`](./packages/react) | Official React component (`<FlickerlessSurface>`) and `useFlickerless` hook | ~1.2 KB |
| [`@flickerless/vue`](./packages/vue) | Official Vue 3 component (`<FlickerlessSurface>`) and composable | ~1.1 KB |

---

## 🚀 Quick Starts

### 1. Vanilla HTML / Web Component (Universal)

Works in plain HTML, Laravel, Django, Svelte, or Angular without build steps:

```html
<link rel="stylesheet" href="node_modules/@flickerless/core/dist/styles.css">
<script type="module" src="node_modules/@flickerless/core/dist/index.esm.js"></script>

<flickerless-surface loading="true" delay="180">
  <table>
    <thead>
      <tr>
        <th>Factura</th>
        <th>Cliente</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <!-- Your table rows -->
    </tbody>
  </table>
</flickerless-surface>
```

---

### 2. React

```tsx
import { FlickerlessSurface } from '@flickerless/react';
import '@flickerless/core/styles.css';

export function InvoicesView() {
  const { data, isFetching } = useInvoicesQuery();

  return (
    <FlickerlessSurface
      loading={isFetching}
      delayMs={180}
      empty={data?.length === 0}
      emptyState={<p>No se encontraron facturas.</p>}
    >
      <table className="w-full">
        <thead>...</thead>
        <tbody>
          {data?.map(invoice => (
            <tr key={invoice.id}>...</tr>
          ))}
        </tbody>
      </table>
    </FlickerlessSurface>
  );
}
```

---

### 3. Vue 3

```vue
<script setup lang="ts">
import { FlickerlessSurface } from '@flickerless/vue';
import '@flickerless/core/styles.css';

const { invoices, isFetching } = useInvoices();
</script>

<template>
  <FlickerlessSurface :loading="isFetching" :delay-ms="180" :empty="invoices.length === 0">
    <table>
      <thead>...</thead>
      <tbody>
        <tr v-for="item in invoices" :key="item.id">...</tr>
      </tbody>
    </table>

    <template #empty>
      <p>No hay facturas disponibles.</p>
    </template>
  </FlickerlessSurface>
</template>
```

---

## ⚙️ Options & API

| Prop / Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `loading` | `boolean` | `false` | Current loading/refetching state |
| `delayMs` | `number` | `180` | Milliseconds to wait before showing loader (anti-flicker threshold) |
| `minDurationMs` | `number` | `250` | Minimum visible duration to prevent sub-frame flashes |
| `keepPreviousData` | `boolean` | `true` | Keep previous rows visible at attenuated opacity |
| `empty` | `boolean` | `false` | Whether dataset has zero items |
| `streamHeight` | `string` | `'2px'` | Height of the glide stream indicator |
| `streamColor` | `string` | CSS var | Custom color or gradient for the stream line |

---

## 🛠️ Local Development & Playground

To run the interactive side-by-side showcase:

```bash
# 1. Install dependencies
npm install

# 2. Run the interactive playground
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to test:
* Side-by-side comparison with legacy skeletons
* Network latency slider (50ms – 1500ms)
* Responsive Mobile Card view transition
* DGII invoice filtering & debounce search

---

## 📄 License

MIT © [Luis M. Taveras](https://github.com/LuisMTaveras)
