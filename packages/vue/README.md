# @flickerless/vue

> **Componentes y directivas oficiales de Flickerless para Vue 3.**  
> Soporte nativo para slots orquestados, TanStack Query, prevención de CLS y mutaciones en línea.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-emerald.svg)](https://vuejs.org/)

---

## 📦 Instalación

```bash
npm install @flickerless/vue @flickerless/core
```

En `src/main.ts`:
```ts
import '@flickerless/core/styles.css';
```

---

## 🧩 Componentes y Utilidades

| Exportable | Tipo | Descripción |
| :--- | :--- | :--- |
| `<FlickerlessSurface>` | Componente | Envoltorio inteligente con slots `#skeleton`, `#empty`, `#error`, `:query` y `:preserve-height`. |
| `<FlickerlessTableSkeleton>` | Componente | Siluetas automáticas para tablas (avatares, códigos monoespaciados, badges). |
| `<FlickerlessChartSkeleton>` | Componente | Siluetas para gráficos analíticos de barras (`bars`) o área (`area`). |
| `<FlickerlessCardSkeleton>` | Componente | Siluetas para tarjetas métricas de dashboard (`kpi`) o contactos (`contact`). |
| `useFlickerlessQuery(query)` | Composable | Normaliza consultas de TanStack Query / Pinia Colada / SWR. |
| `vFlickerlessSaving` | Directiva | Directiva `v-flickerless-saving` para estados de guardado en fila o botón individual. |

---

## 🛠️ Ejemplos de Uso

### 1. Con Slots Limpios y Prevención de Saltos de Altura

```vue
<script setup lang="ts">
import { FlickerlessSurface, FlickerlessTableSkeleton, vFlickerlessSaving } from '@flickerless/vue';

defineProps<{
  items: any[];
  cargando: boolean;
  guardandoId?: string | null;
}>();
</script>

<template>
  <FlickerlessSurface 
    :loading="cargando" 
    :empty="items.length === 0" 
    :preserve-height="true"
    :delay-ms="180"
  >
    <!-- Cold start -->
    <template #skeleton>
      <table class="w-full">
        <FlickerlessTableSkeleton :rows="6" :columns="5" />
      </table>
    </template>

    <!-- Empty state -->
    <template #empty>
      <p class="text-zinc-500 py-8 text-center">No hay registros.</p>
    </template>

    <!-- Filas reales (se atenúan al 50% en recargas) -->
    <table class="w-full">
      <tbody>
        <tr 
          v-for="item in items" 
          :key="item.id"
          v-flickerless-saving="guardandoId === item.id"
        >
          <td>{{ item.nombre }}</td>
          <td>{{ item.codigo }}</td>
        </tr>
      </tbody>
    </table>
  </FlickerlessSurface>
</template>
```

---

### 2. Integración con TanStack Query (`:query`)

```vue
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { FlickerlessSurface, FlickerlessTableSkeleton } from '@flickerless/vue';

const facturasQuery = useQuery({ queryKey: ['facturas'], queryFn: fetchFacturas });
</script>

<template>
  <FlickerlessSurface :query="facturasQuery" :preserve-height="true">
    <template #skeleton>
      <FlickerlessTableSkeleton :rows="6" :columns="6" />
    </template>

    <template #empty>
      <p>Directorio vacío.</p>
    </template>

    <table>
      <tr v-for="f in facturasQuery.data.value" :key="f.id">...</tr>
    </table>
  </FlickerlessSurface>
</template>
```

---

## 📄 Licencia

MIT © Flickerless Team
