# @flickerless/vue

> Superficie, valor y carcasa de tabla de Flickerless para Vue 3: carga sin skeletons.
> Lo que ya estaba se queda; lo que aún no existe es «—».

## Instalación

```bash
npm install @flickerless/vue @flickerless/core
```

```ts
// main.ts
import '@flickerless/core/styles.css';
```

## Exportables

| Exportable | Tipo | Qué hace |
| :--- | :--- | :--- |
| `<FlickerlessSurface>` | Componente | Atenúa lo que ya había y pinta la barra de 2 px pasado el umbral (`delayMs`, 180 ms). Props: `loading`, `settled`, `empty`, `error`, `query`, `preserveHeight`, `delayMs`, `minDurationMs`, `announceText`, `streamHeight`, `streamColor`. Slots: `#default="{ settled }"`, `#empty` (solo con respuesta), `#error="{ error }"`. |
| `<FlickerlessValue>` | Componente | «—» atenuado si `value` es `null`/`undefined` o la superficie aún no respondió. El slot por defecto (`{ value }`) formatea el valor cuando existe. |
| `<FlickerlessTableShell>` | Componente | Filas reales con «—» en cada celda para la carga en frío de una tabla. Props: `cols` (= número de `<th>`), `rows`, `rowClass`, `cellClass`. |
| `useFlickerless(options)` | Composable | El controlador anti-parpadeo con estado reactivo (`isVisibleLoading`, `status`). |
| `useFlickerlessQuery(query)` | Composable | Normaliza TanStack Query / Vue Query / Pinia Colada / SWR. |
| `FLICKERLESS_SETTLED` | Inyección | Si la superficie que envuelve a un componente ya respondió; para valores propios. |
| `vFlickerlessSaving` | Directiva | Atenúa y pinta un haz en la fila o el botón que se está guardando. |

## Tabla

```vue
<FlickerlessSurface :loading="loading" :preserve-height="true">
  <table>
    <thead>…6 columnas…</thead>
    <tbody>
      <FlickerlessTableShell v-if="loading && !rows.length" :cols="6" cell-class="px-4 py-3" />
      <tr v-else-if="!rows.length"><td colspan="6">Sin resultados.</td></tr>
      <tr v-for="row in rows" v-else :key="row.id" v-flickerless-saving="savingId === row.id">…</tr>
    </tbody>
  </table>
</FlickerlessSurface>
```

Una recarga (paginar, filtrar) deja las filas atenuadas; la carcasa solo aparece cuando
no hay nada que conservar.

## Cifras

```vue
<FlickerlessSurface :loading="loading" :settled="loaded" :error="loadError" :empty="!rows.length">
  <template #empty>Sin ingresos en el período.</template>
  <p class="label">Ingresos</p>
  <p class="amount">
    <FlickerlessValue :value="loaded ? total : null" v-slot="{ value }">{{ formatMoney(value) }}</FlickerlessValue>
  </p>
</FlickerlessSurface>
```

Nunca `total || 0`: un cero mientras carga es una cifra falsa.

## Ficha de detalle

```vue
<DocumentShell v-if="loading && !doc" />
<FlickerlessSurface v-else-if="doc" :loading="loading">…el documento…</FlickerlessSurface>
```

La carcasa de una ficha es la estructura real de **tu** pantalla (cabecera, fichas,
líneas) con `<FlickerlessValue />` donde va cada dato; recargar el mismo documento lo
deja en pantalla, atenuado. Si cambia el sujeto (otro cliente, otro documento), se
vacía: lo anterior no es suyo.

## TanStack Query

```vue
<FlickerlessSurface :query="invoicesQuery" :preserve-height="true">
  <template #empty>No hay facturas.</template>
  <template #error="{ error }">No se pudo cargar: {{ error.message }}</template>
  <InvoicesTable :rows="invoicesQuery.data.value ?? []" />
</FlickerlessSurface>
```

## Migrar desde los `Flickerless*Skeleton`

Los componentes `FlickerlessSkeleton`, `FlickerlessTableSkeleton`, `FlickerlessCardSkeleton`,
`FlickerlessChartSkeleton` y `FlickerlessFormSkeleton` y sus clases CSS
(`.flickerless-skeleton`, `.shimmer-surface`, `.flickerless-chart-*`) **ya no existen**:

| Antes | Ahora |
| :--- | :--- |
| `<FlickerlessTableSkeleton>` en `#skeleton` | `<FlickerlessTableShell>` dentro del `<tbody>` real |
| `<FlickerlessCardSkeleton type="kpi">` | Las tarjetas reales con `<FlickerlessValue>` en cada cifra y `:settled` en la superficie |
| `<FlickerlessChartSkeleton>` | El marco del gráfico con su alto, vacío hasta la respuesta |
| `<FlickerlessFormSkeleton>` | El formulario real; los campos se llenan al responder |
| `:empty="isColdStart"` para forzar el frío | `:settled="!isColdStart"` |

## Licencia

MIT
