# @flickerless/react

Superficie, valor y carcasa de tabla de Flickerless para React DOM: carga sin skeletons.
Lo que ya estaba se queda; lo que aún no existe es «—».

## Instalación

```bash
npm install @flickerless/react @flickerless/core
```

```ts
import '@flickerless/core/styles.css';
```

## Exportables

| Exportable | Qué hace |
| :--- | :--- |
| `FlickerlessSurface` | Atenúa lo que ya había y pinta la barra de 2 px pasado el umbral. Props: `loading`, `settled`, `empty`, `error`, `emptyState` (solo con respuesta), `errorState`, `delayMs`, `minDurationMs`, `announceText`, `streamHeight`, `streamColor`. `children` puede ser una función `({ settled }) => …`. |
| `FlickerlessValue` | «—» atenuado si `value` es `null`/`undefined` o la superficie aún no respondió. `children` opcional: `(value) => …`. |
| `FlickerlessTableShell` | Filas reales con «—» para la carga en frío de una tabla. Props: `cols`, `rows`, `rowClassName`, `cellClassName`. |
| `useFlickerless(options)` | El controlador anti-parpadeo (`isVisibleLoading`, `status`, `surfaceProps`, `bodyProps`). |
| `useSettled()` | Si la superficie que envuelve al componente ya respondió (`null` sin superficie). |

## Uso

```tsx
import { FlickerlessSurface, FlickerlessTableShell, FlickerlessValue } from '@flickerless/react';

export function InvoicesTable({ rows, loading, loaded, total }: Props) {
  return (
    <FlickerlessSurface loading={loading} settled={loaded} empty={!rows.length} emptyState={<p>No hay facturas.</p>}>
      <p>Total: <FlickerlessValue value={loaded ? total : null}>{(v) => formatMoney(v)}</FlickerlessValue></p>
      <table>
        <thead>…5 columnas…</thead>
        <tbody>
          {loading && !rows.length ? (
            <FlickerlessTableShell cols={5} cellClassName="px-4 py-3" />
          ) : (
            rows.map((row) => <tr key={row.id}>…</tr>)
          )}
        </tbody>
      </table>
    </FlickerlessSurface>
  );
}
```

## Licencia

MIT
