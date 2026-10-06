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
| `<FlickerlessSkeleton>` | Componente | **Primitiva universal** de carga (inputs, botones, avatares, textos). |
| `<FlickerlessFormSkeleton>` | Componente | **Formularios listos** en 1 línea (etiquetas, inputs, botones de acción). |
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

### 3. Formularios, Modales y Drawers (`<FlickerlessFormSkeleton>`)

```vue
<script setup lang="ts">
import { FlickerlessSurface, FlickerlessFormSkeleton } from '@flickerless/vue';

defineProps<{
  cliente: any | null;
  cargando: boolean;
}>();
</script>

<template>
  <div class="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg">
    <h3 class="text-sm font-bold text-zinc-100 mb-4">Editar Datos de Facturación</h3>

    <FlickerlessSurface :loading="cargando" :empty="!cliente">
      <!-- Carga inicial en frío del formulario (etiquetas, inputs y botones) -->
      <template #skeleton>
        <FlickerlessFormSkeleton :fields="4" :columns="1" />
      </template>

      <!-- Formulario real: al guardar o recargar, se atenúa al 50% con la micro-barra -->
      <form @submit.prevent="guardar" class="space-y-4">
        <div>
          <label class="text-xs text-zinc-400">Razón Social</label>
          <input v-model="cliente.razon_social" class="w-full p-2 bg-zinc-900 border border-zinc-800 rounded" />
        </div>
        <div>
          <label class="text-xs text-zinc-400">RNC</label>
          <input v-model="cliente.rnc" class="w-full p-2 bg-zinc-900 border border-zinc-800 rounded" />
        </div>
        <button type="submit" class="px-4 py-2 bg-emerald-600 rounded text-xs">Guardar Cambios</button>
      </form>
    </FlickerlessSurface>
  </div>
</template>
```

---

### 4. Primitivas Libres (`<FlickerlessSkeleton>`)

Para cuando quieres construir maquetas libres estilo *shadcn*:

```vue
<script setup lang="ts">
import { FlickerlessSkeleton } from '@flickerless/vue';
</script>

<template>
  <div class="space-y-4">
    <!-- Avatar circular -->
    <FlickerlessSkeleton class="w-12 h-12 rounded-full" />

    <!-- Campo de entrada (Input) -->
    <FlickerlessSkeleton class="h-10 w-full rounded-lg" />

    <!-- Botón -->
    <FlickerlessSkeleton class="h-9 w-32 rounded-md" />

    <!-- Línea de texto -->
    <FlickerlessSkeleton class="h-4 w-3/4 rounded" />
  </div>
</template>
```

---

## 📄 Licencia

MIT © Flickerless Team
