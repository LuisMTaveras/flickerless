# @flickerless/core

Framework-agnostic engine, CSS and Web Component for layout-stable, zero-flicker data surfaces.

## Installation

```bash
npm install @flickerless/core
```

## Quick Start (Pure HTML / Vanilla JS)

```html
<link rel="stylesheet" href="@flickerless/core/styles.css">
<script type="module" src="@flickerless/core"></script>

<flickerless-surface loading="true" delay="180">
  <table>
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</flickerless-surface>
```
