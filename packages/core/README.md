# @flickerless/core

Motor de Flickerless sin framework: el controlador anti-parpadeo, el CSS de la web y
un Web Component opcional.

## Instalación

No está publicado en npmjs.com: se instala con DEVFORGE, desde el `.tgz` (`pnpm pack:all` en la raíz) o como
copia del código. Pasos en el [README principal](../../README.md#-instalación).

## El controlador

Sin DOM: funciona en el navegador, en Node y en React Native.

```ts
import { FlickerlessController } from '@flickerless/core';

const controller = new FlickerlessController({
  loading: true,
  delayMs: 180,       // una respuesta más rápida nunca enciende el indicador
  minDurationMs: 250, // una vez encendido, no se apaga antes (sin parpadeo)
  onStateChange: ({ isVisibleLoading, status }) => render(isVisibleLoading, status),
});

controller.update({ loading: false });
controller.destroy();
```

## CSS

```ts
import '@flickerless/core/styles.css';
```

Clases: `.flickerless-surface`, `.flickerless-stream`, `.flickerless-body`,
`.flickerless-unknown` («—»), `.flickerless-saving`, `.flickerless-empty-state`,
`.flickerless-error-state`. Colores neutros, personalizables con las variables
`--flickerless-*` (ver el README raíz).

## Web Component (opcional)

Vive en su propia entrada porque extiende `HTMLElement` al importarse:

```ts
import '@flickerless/core/element';
```

```html
<flickerless-surface loading delay="180">
  <table>…</table>
</flickerless-surface>
```

Atributos: `loading`, `empty`, `error` (presente = error, aunque esté vacío; `error="false"` no), `delay`
(= 180), `min-duration` (= 250) y `announce-text` (= «Actualizando…»). Todos se pueden cambiar en vivo. El
elemento escribe `data-loading`, `data-status` y `aria-busy`, y mueve a `.flickerless-body` también los hijos
que se añadan después de montarlo.

`isEmptyValue(data)` y `readQueryState(query)` son el criterio común de «vacío» y «ya respondió» que usan los
adaptadores; sirven para una vista propia.
