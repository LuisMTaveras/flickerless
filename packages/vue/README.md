# @flickerless/vue

Official Vue 3 components and composables for Flickerless data surfaces.

## Installation

```bash
npm install @flickerless/vue @flickerless/core
```

## Quick Start

```vue
<script setup lang="ts">
import { FlickerlessSurface } from '@flickerless/vue';
import '@flickerless/core/styles.css';

const { data, isPending } = useInvoices();
</script>

<template>
  <FlickerlessSurface :loading="isPending" :delay-ms="180" :empty="data?.length === 0">
    <table>
      <thead>...</thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">...</tr>
      </tbody>
    </table>

    <template #empty>
      <p>No se encontraron comprobantes fiscales.</p>
    </template>
  </FlickerlessSurface>
</template>
```
