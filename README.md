# ⚡ Flickerless

> **El estándar de carga de datos sin fatiga visual, sin saltos de pantalla (0.00 CLS) y sin escribir maquetas manuales.**  
> Diseñado para tablas analíticas, gráficos y paneles de control profesionales (CRM, ERP, Finanzas, Dashboards).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Zero CLS](https://img.shields.io/badge/CLS-0.00-brightgreen.svg)](https://web.dev/cls/)
[![Bundle Size](https://img.shields.io/badge/Bundle-<2KB-success.svg)](https://bundlephobia.com)

---

## 🎯 ¿Por qué Flickerless es infinitamente superior a los Skeletons tradicionales?

Los **Skeleton Screens** nacieron en 2014 para feeds de redes sociales. En aplicaciones de negocio reales (tablas densas, analíticas, paneles de control), se convierten en un dolor de cabeza técnico y visual:

```
❌ SKELETON TRADICIONAL (Fatiga Ocular & Parpadeo Constante)
[Filtro: Activos] ──> [Borrón gris pulsando 200ms] ──> [Nueva tabla aparece] ──> Brinco de pantalla (CLS)

✨ FLICKERLESS (Carga Calmada estilo Linear / Stripe)
[Filtro: Activos] ──> [Filas reales al 50% + barra 2px] ──> [Transición suave] ──> CERO saltos (0.00 CLS)
```

### Los 4 Dolores Críticos del Skeleton Tradicional:

| Problema | Con Skeleton Tradicional | Con Flickerless |
| :--- | :--- | :--- |
| **1. Infierno de Mantenimiento** | Tienes que programar 40 líneas de `<div>` grises por cada tabla o pantalla. Si agregas una columna o cambias estilos, tienes que reescribir el skeleton a mano. | **Cero mantenimiento:** En recargas, el propio contenido real actúa como su layout. Para cargas iniciales en frío, usas un componente preconstruido de **1 sola línea**. |
| **2. Parpadeo y Fatiga Ocular (*Micro-flickering*)** | Si tu API responde en 150–250ms, la pantalla borra los datos existentes y parpadea con rectángulos grises titilando como una bombilla rota. Cansa la vista. | **Umbral Anti-Flicker (180ms):** Si la API responde rápido, la pantalla ni parpadea. Si tarda, mantiene los datos existentes legibles al 50% con un haz de luz GPU a 110°. |
| **3. Salto de Pantalla (*Cumulative Layout Shift - CLS*)** | El skeleton casi nunca mide lo mismo que las filas o gráficos finales. Al llegar los datos, la paginación o el footer saltan bruscamente (CLS > 0.25). | **0.000 CLS Garantizado:** Retención dinámica de altura con `preserveHeight`. El contenedor no colapsa ni salta de tamaño jamás. |
| **4. El Engaño del "Falso Resultado"** | Al filtrar por un término sin resultados, el skeleton te muestra 6 filas pulsando durante 300ms haciéndote creer que hay datos en camino, para luego decir "0 registros". | **Visualmente veraz:** No simula datos falsos donde no existen. Muestra la realidad con elegancia. |

---

## 🧠 El Modelo Mental de Flickerless: Las Dos Fases de los Datos

Cualquier pantalla de datos atraviesa **dos fases distintas**:

```
                             ┌──────────────────────────────────────┐
                             │    FASE 1: COLD START (En Frío)      │
                             │  La página acaba de abrirse.         │
                             │  clientes.length === 0 && cargando   │
                             └──────────────────┬───────────────────┘
                                                │
                          ¿Cómo carga?          ▼
                          👉 Usas el slot #skeleton: <FlickerlessTableSkeleton />
                                                │
                                                ▼
                             ┌──────────────────────────────────────┐
                             │   PANTALLA CON DATOS CARGADOS        │
                             │  El usuario lee 15 filas de clientes │
                             └──────────────────┬───────────────────┘
                                                │
                               El usuario busca │
                               o cambia página  ▼
                             ┌──────────────────────────────────────┐
                             │    FASE 2: WARM REFETCH (Recarga)    │
                             │  El usuario interactúa.              │
                             │  clientes.length > 0 && cargando     │
                             └──────────────────┬───────────────────┘
                                                │
                          ¿Cómo carga?          ▼
                          👉 CERO CÓDIGO EXTRA: <FlickerlessSurface>
                             mantiene las filas anteriores legibles al 50%
                             con la micro-barra de 2px y el haz a 110°.
```

---

## 📦 Instalación

```bash
npm install @flickerless/vue @flickerless/core
```

En tu `src/main.ts`:
```ts
// Importa los estilos GPU globales una sola vez
import '@flickerless/core/styles.css';
```

---

## 🛠️ Guía de Implementación Paso a Paso

---

### CASO 1: Tablas con Slots Limpios (`#skeleton`, `#empty`, `#default`)

Olvídate de condiciones booleanas enredadas (`cargando && items.length === 0`). `<FlickerlessSurface>` orquesta todo:

```vue
<script setup lang="ts">
import { FlickerlessSurface, FlickerlessTableSkeleton, vFlickerlessSaving } from '@flickerless/vue';

defineProps<{
  clientes: any[];
  cargando: boolean;
  guardandoId?: string | null;
}>();
</script>

<template>
  <!-- preserve-height congela la altura para garantizar 0.00 CLS -->
  <FlickerlessSurface 
    :loading="cargando" 
    :empty="clientes.length === 0" 
    :preserve-height="true"
    :delay-ms="180"
  >
    <!-- ⚡ 1. Carga inicial en frío (se renderiza solo si está cargando y no hay datos) -->
    <template #skeleton>
      <table class="w-full text-left text-xs">
        <thead>...</thead>
        <FlickerlessTableSkeleton :rows="6" :columns="6" />
      </table>
    </template>

    <!-- ⚡ 2. Estado vacío limpio si la búsqueda da 0 resultados -->
    <template #empty>
      <div class="py-12 text-center text-zinc-500">
        No se encontraron clientes coincidentes.
      </div>
    </template>

    <!-- ⚡ 3. Tabla real normal (al filtrar o paginar, se atenúa sola al 50%) -->
    <table class="w-full text-left text-xs">
      <thead>
        <tr>
          <th>Código</th>
          <th>Razón Social</th>
          <th>Sector</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="c in clientes" 
          :key="c.id"
          v-flickerless-saving="guardandoId === c.id"
        >
          <td>{{ c.codigo }}</td>
          <td>{{ c.razon_social }}</td>
          <td>{{ c.sector }}</td>
          <td>{{ c.estado }}</td>
          <td>
            <button @click="$emit('guardar', c.id)">Guardar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </FlickerlessSurface>
</template>
```

> **Nota:** La directiva `v-flickerless-saving="guardandoId === c.id"` aplica el haz de luz y atenuación **únicamente a la fila que se está guardando** en la base de datos sin bloquear el resto de la interfaz.

---

### CASO 2: Integración Directa con TanStack Query / Vue Query

Si usas `@tanstack/vue-query` o Pinia Colada, pasa directamente el objeto query con la prop `:query`:

```vue
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { FlickerlessSurface, FlickerlessTableSkeleton } from '@flickerless/vue';

// Tu consulta estándar de TanStack Query
const clientesQuery = useQuery({
  queryKey: ['clientes', parametros],
  queryFn: () => fetchClientes(parametros),
});
</script>

<template>
  <!-- Flickerless detecta isPending, isFetching, isPlaceholderData, isEmpty y error automáticamente -->
  <FlickerlessSurface :query="clientesQuery" :preserve-height="true">
    <template #skeleton>
      <FlickerlessTableSkeleton :rows="6" :columns="5" />
    </template>

    <template #empty>
      <p>No hay clientes.</p>
    </template>

    <template #error="{ error }">
      <p class="text-rose-500">Error al consultar datos: {{ error.message }}</p>
    </template>

    <!-- Datos reales: al paginar o filtrar se atenúan al 50% con la micro-barra -->
    <table>
      <tr v-for="c in clientesQuery.data.value" :key="c.id">
        <td>{{ c.razon_social }}</td>
      </tr>
    </table>
  </FlickerlessSurface>
</template>
```

---

### CASO 3: Gráficos Analíticos (Bar Charts, ApexCharts, Chart.js)

```vue
<script setup lang="ts">
import { FlickerlessSurface, FlickerlessChartSkeleton } from '@flickerless/vue';

defineProps<{
  datosMensuales: any[];
  cargandoGrafico: boolean;
}>();
</script>

<template>
  <div class="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl">
    <h3 class="text-sm font-semibold text-zinc-200 mb-4">Facturación Mensual B2B</h3>

    <!-- Reserva su altura exacta (h-56) para 0.00 CLS -->
    <FlickerlessSurface :loading="cargandoGrafico" :empty="datosMensuales.length === 0">
      <template #skeleton>
        <FlickerlessChartSkeleton type="bars" height="h-56" />
      </template>

      <!-- Al cambiar filtros o fechas, el gráfico actual queda congelado al 50% con la micro-barra superior -->
      <div class="h-56 w-full">
        <MiComponenteDeGrafico :datos="datosMensuales" />
      </div>
    </FlickerlessSurface>
  </div>
</template>
```

---

### CASO 4: Tarjetas de Métricas y KPIs (Dashboards)

```vue
<script setup lang="ts">
import { FlickerlessSurface, FlickerlessCardSkeleton } from '@flickerless/vue';

defineProps<{
  kpis: { clientes: number; ingresos: number; tareas: number; retencion: string } | null;
  cargandoKpis: boolean;
}>();
</script>

<template>
  <FlickerlessSurface :loading="cargandoKpis" :empty="!kpis">
    <!-- Carga inicial en frío (1 línea para 4 tarjetas métricas con siluetas) -->
    <template #skeleton>
      <FlickerlessCardSkeleton :count="4" type="kpi" />
    </template>

    <!-- Tarjetas reales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div class="text-xs text-zinc-400">Clientes Activos</div>
        <div class="text-2xl font-bold font-mono text-zinc-100 mt-2">{{ kpis?.clientes }}</div>
      </div>
      <!-- más tarjetas... -->
    </div>
  </FlickerlessSurface>
</template>
```

---

## ♿ Accesibilidad Universal (a11y)

Flickerless incluye accesibilidad certificada out-of-the-box:
1. **Lectores de pantalla:** Emite anuncios invisibles `aria-live="polite"` (`aria-busy="true"`) cuando inicia y finaliza una recarga.
2. **Sensibilidad al movimiento:** Respeta automáticamente `@media (prefers-reduced-motion: reduce)`. Los usuarios con sensibilidad vestibular no verán ondas de luz aceleradas, sino una atenuación estática y suave.

---

## 🎮 Laboratorio Interactivo

Puedes probar la comparativa en vivo abriendo el playground en tu terminal:

```bash
npm run dev
```

En `http://localhost:3000` podrás:
* Alternar entre **[ ⚡ Flickerless Calm ]** y **[ 💀 Skeleton Clásico ]**.
* Ajustar la **Latencia de Red** (`150ms`, `400ms`, `900ms`, `1.8s`).
* Probar el **Flicker Counter** y la puntuación de **Layout Shift (CLS)** en vivo.
* Probar la mutación en línea con el botón **"Guardar Fila"**.

---

## 📄 Licencia

MIT © Flickerless Team
