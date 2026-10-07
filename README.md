# ⚡ Flickerless

> **Lo que ya estaba se queda; lo que aún no existe es «—».**
> Carga de datos sin skeletons, sin spinners que tapan la pantalla y sin saltos (0.00 CLS).
> Para tablas, gráficos y paneles de negocio (CRM, ERP, finanzas) en Vue, React y React Native.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Zero CLS](https://img.shields.io/badge/CLS-0.00-brightgreen.svg)](https://web.dev/cls/)

---

## 🎯 Por qué no un skeleton

Un skeleton y un spinner grande fallan igual en lo que importa:

- **En cada recarga** (paginar, filtrar, cambiar el período) el usuario pierde lo
  que estaba mirando y la pantalla salta.
- **Antes de la primera respuesta** se le enseña una forma —o peor, una cifra—
  que no es verdad. En una pantalla financiera, «$0.00» mientras carga no es un
  hueco: es una cifra falsa. «No hay facturas» durante los primeros 180 ms es
  una alarma falsa.

```
❌ SKELETON
[Filtro] ──> [Cajas grises pulsando] ──> [Tabla nueva] ──> la pantalla salta

✨ FLICKERLESS
[Filtro] ──> [Filas reales atenuadas + barra de 2 px] ──> [Datos nuevos] ──> nada salta
```

| Problema | Skeleton | Flickerless |
| :--- | :--- | :--- |
| **Mantenimiento** | Una maqueta gris por pantalla que hay que reescribir al cambiar una columna. | En recargas el contenido real es su propia maqueta. En frío, la estructura real con «—». |
| **Parpadeo** | Una respuesta de 150 ms borra los datos y pinta cajas grises. | Umbral anti-parpadeo (180 ms): si la respuesta llega antes, no se enseña nada. |
| **Saltos (CLS)** | El skeleton casi nunca mide lo que mide el contenido final. | Las filas y paneles son los reales; `preserveHeight` congela la altura en recargas. |
| **Datos falsos** | Seis filas pulsando para luego decir «0 registros»; un cero mientras carga. | «Vacío» solo con una respuesta en la mano; un dato desconocido es «—», nunca un cero. |

---

## 🧩 Las tres piezas

| Pieza | Qué hace |
| :--- | :--- |
| **`FlickerlessSurface`** | Envuelve una zona de datos. Si la respuesta tarda menos de `delayMs` (180 ms) no enseña nada; si tarda más, **atenúa lo que ya había** y pinta una barra de 2 px arriba. El estado vacío solo aparece **con una respuesta en la mano**. |
| **`FlickerlessValue`** | Un dato que puede no existir todavía. Pinta «—» atenuado (y «Sin dato todavía» para el lector de pantalla) si `value` es `null`/`undefined` o si la superficie que lo envuelve aún no respondió. |
| **`settled`** | Si la superficie ya tuvo una respuesta. Sin la prop se deduce (una carga terminada sin error); se pasa explícita cuando la pantalla ya lo sabe. |

Y una carcasa lista para la carga en frío de una tabla: **`FlickerlessTableShell`**
(Vue y React), filas reales con «—» en cada celda.

| Paquete | Para |
| :--- | :--- |
| [`@flickerless/core`](./packages/core) | Controlador anti-parpadeo sin DOM (umbral y duración mínima), CSS y un Web Component opcional. |
| [`@flickerless/vue`](./packages/vue) | Vue 3: superficie, valor, carcasa de tabla, `useFlickerlessQuery` y `v-flickerless-saving`. |
| [`@flickerless/react`](./packages/react) | React DOM: superficie, valor, carcasa de tabla y `useFlickerless`. |
| [`@flickerless/react-native`](./packages/react-native) | React Native: superficie (barra animada nativa), valor y proveedor de colores. |

---

## 🧠 El modelo mental: dos fases

```
FASE 1 · EN FRÍO                     FASE 2 · RECARGA
La pantalla acaba de abrirse.        El usuario pagina, filtra o refresca.
No hay nada que conservar.           Hay datos en pantalla.
        │                                    │
        ▼                                    ▼
La CARCASA real: encabezados,        CERO código extra: la superficie deja
etiquetas, columnas y «—» donde      lo que había, atenuado, con la barra
va cada dato. Nunca un cero.         de 2 px. Nada desaparece, nada salta.
```

### La carga en frío: carcasa, no skeleton

- **Cifras**: `null` hasta la primera respuesta y `FlickerlessValue` las pinta «—». Nunca `|| 0` para «rellenar».
- **Mensajes de vacío**: solo con una respuesta (`settled`).
- **Tablas**: `FlickerlessTableShell` dentro del `<tbody>` real, con tantas columnas como `<th>`.
- **Gráficos**: el marco vacío del tamaño del gráfico, sin texto.
- **Error**: un aviso con «Reintentar». Un fallo **no** es un panel en cero, y lo que ya se había cargado se queda.
- **Nada desaparece al recargar**: un bloque con `v-if="!loading"` se borra en cada consulta; se deja siempre y su valor va por `FlickerlessValue`.

### Otra entidad no se conserva

Conservar vale para **recargar lo mismo**. Si cambia el sujeto —otro cliente, otro
documento—, lo anterior no es suyo: se vacía y se ve la carcasa. Dejar atenuadas las
facturas del cliente anterior pondría facturas ajenas bajo el nombre del nuevo.

---

## 📦 Instalación

```bash
npm install @flickerless/vue @flickerless/core      # Vue 3
npm install @flickerless/react @flickerless/core    # React DOM
npm install @flickerless/react-native @flickerless/core
```

En la web, importa los estilos una sola vez:

```ts
import '@flickerless/core/styles.css';
```

---

## 🛠️ Uso

### Tablas: la condición es «no hay nada que conservar»

```vue
<script setup lang="ts">
import { FlickerlessSurface, FlickerlessTableShell } from '@flickerless/vue';
const props = defineProps<{ rows: Invoice[]; loading: boolean }>();
</script>

<template>
  <FlickerlessSurface :loading="loading" :preserve-height="true">
    <table>
      <thead>…7 columnas…</thead>
      <tbody>
        <FlickerlessTableShell v-if="loading && !rows.length" :cols="7" />
        <tr v-else-if="!rows.length"><td colspan="7">Sin resultados.</td></tr>
        <tr v-for="row in rows" v-else :key="row.id">…</tr>
      </tbody>
    </table>
  </FlickerlessSurface>
</template>
```

El error clásico que esto corrige: `<Skeleton v-if="loading">` borraba las filas en
**cada** recarga, no solo en la primera.

### Cifras y paneles

```vue
<FlickerlessSurface :loading="loading" :settled="loaded" :error="loadError" :empty="!rows.length">
  <template #empty>Sin ingresos en el período.</template>
  <p>Ingresos: <FlickerlessValue :value="loaded ? formatMoney(total) : null" /></p>
</FlickerlessSurface>
```

```tsx
// React DOM
<FlickerlessSurface loading={loading} settled={loaded} error={error} empty={!rows.length} emptyState={<p>Sin ingresos.</p>}>
  <p>Ingresos: <FlickerlessValue value={loaded ? formatMoney(total) : null} /></p>
</FlickerlessSurface>
```

```tsx
// React Native
<FlickerlessSurface loading={loading} settled={loaded} error={error} empty={!rows.length} renderEmpty={() => <EmptyState />}>
  <FlickerlessValue value={loaded ? formatMoney(total) : null} style={styles.amount} />
</FlickerlessSurface>
```

### TanStack Query / Vue Query

```vue
<FlickerlessSurface :query="invoicesQuery" :preserve-height="true">
  <template #empty>No hay facturas.</template>
  <template #error="{ error }">No se pudo cargar: {{ error.message }}</template>
  <InvoicesTable :rows="invoicesQuery.data.value ?? []" />
</FlickerlessSurface>
```

### Guardado en línea

```vue
<tr v-for="row in rows" :key="row.id" v-flickerless-saving="savingId === row.id">…</tr>
```

Atenúa y pinta un haz **solo en la fila que se guarda**, sin bloquear el resto.

### En móvil: el spinner

En móvil el problema mayor es un `<ActivityIndicator size="large">` ocupando la
pantalla en cada recarga. La regla es la misma: la lista que ya estaba se queda
atenuada con la barra arriba. Una `FlatList` va dentro de
`<FlickerlessSurface loading={…} fill>`. El spinner **pequeño dentro de un botón**
que guarda es legítimo: dice que ESE acto está en curso, no tapa nada.

---

## 🎨 Personalización

Los colores por defecto son neutros. La app los sustituye redefiniendo las variables:

```css
:root {
  --flickerless-stream-color: var(--my-brand);
  --flickerless-stream-bg: color-mix(in srgb, var(--my-brand) 15%, transparent);
  --flickerless-unknown-color: var(--my-text-dim);
  --flickerless-muted-color: var(--my-text-muted);
  --flickerless-danger-color: var(--my-danger);
  --flickerless-saving-beam: rgba(16, 185, 129, 0.18);
  --flickerless-attenuation-opacity: 0.52;
  --flickerless-stream-height: 2px;
}
```

En React Native: `<FlickerlessColorsProvider value={{ stream, track, unknown }}>`.

---

## ♿ Accesibilidad

1. **Lectores de pantalla:** la superficie anuncia la recarga con `aria-live="polite"` y marca `aria-busy`; un dato desconocido se lee «Sin dato todavía», no «guion».
2. **Reducir movimiento:** respeta `prefers-reduced-motion` (y `AccessibilityInfo` en React Native): sin barra que corre, solo la atenuación.

---

## 🎮 Laboratorio

```bash
npm install
npm run dev
```

En `http://localhost:3000` puedes alternar entre **Flickerless** y **Skeleton clásico**,
ajustar la latencia de red, forzar una carga en frío y probar el guardado en línea.

## 🧪 Desarrollo

```bash
npm run build       # todos los paquetes y el playground
npm run typecheck
npm test            # tests del controlador (vitest)
```

---

## 📄 Licencia

MIT © Luis M. Taveras
