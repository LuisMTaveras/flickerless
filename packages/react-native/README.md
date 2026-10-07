# @flickerless/react-native

Superficie, valor y hook de Flickerless para React Native: carga sin skeletons ni
spinners que tapan la pantalla. Lo que ya estaba se queda, atenuado, con una barra de
2 px arriba; lo que aún no existe es «—».

## Instalación

```bash
npm install @flickerless/react-native @flickerless/core
```

Sin CSS: la barra es una `Animated.View` con el driver nativo, y respeta «reducir
movimiento» del sistema.

## Exportables

| Exportable | Qué hace |
| :--- | :--- |
| `FlickerlessSurface` | Props: `loading`, `settled`, `empty`, `error`, `renderEmpty` (solo con respuesta), `delayMs`, `minDurationMs`, `fill` (ocupa el alto disponible, para una `FlatList`), `announceText`, `style`. `children` puede ser `({ settled }) => …`. |
| `FlickerlessValue` | Un `Text` con «—» si `value` es `null`/`undefined` o la superficie aún no respondió. `children` opcional: `(value) => …`. |
| `FlickerlessColorsProvider` | Colores de la barra (`stream`), su riel (`track`) y el «—» (`unknown`). Por defecto, neutros. |
| `useFlickerless(options)` | El controlador anti-parpadeo con estado de React. |
| `useSettled()` / `useFlickerlessColors()` | Lecturas del contexto, para carcasas propias. |

## Uso

```tsx
import { FlickerlessColorsProvider, FlickerlessSurface, FlickerlessValue } from '@flickerless/react-native';

<FlickerlessColorsProvider value={{ stream: theme.tint, track: theme.border, unknown: theme.muted }}>
  <App />
</FlickerlessColorsProvider>

function Orders({ orders, loading, refetch }: Props) {
  return (
    <FlickerlessSurface loading={loading} empty={!orders.length} renderEmpty={() => <EmptyOrders />} fill>
      {loading && !orders.length ? (
        <OrdersShell />
      ) : (
        <FlatList data={orders} renderItem={renderOrder} onRefresh={refetch} refreshing={false} />
      )}
    </FlickerlessSurface>
  );
}
```

`OrdersShell` es la carcasa de **tu** pantalla: las filas reales con
`<FlickerlessValue />` donde va cada dato. No barras grises que pulsan.

El `ActivityIndicator` **pequeño dentro de un botón** que guarda sigue siendo
legítimo: dice que ese acto está en curso, no tapa nada. El que ocupa la pantalla
(`size="large"`) es el que esta librería sustituye.

## Licencia

MIT
