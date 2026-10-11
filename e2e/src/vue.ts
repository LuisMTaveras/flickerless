import '@flickerless/core/styles.css';
import { createApp, h, reactive } from 'vue';
import { FlickerlessSurface, FlickerlessValue } from '@flickerless/vue';

const s = reactive({ loading: false, empty: true, error: null as string | null, value: null as number | null, rows: 3, query: null as unknown });
Object.assign(window, { s });
createApp({
  render: () =>
    h(FlickerlessSurface, { id: 'surface', loading: s.loading, empty: s.empty, error: s.error, query: s.query as never, preserveHeight: true, delayMs: 0, minDurationMs: 0 }, {
      default: () => h('div', { id: 'body' }, [h('p', [h(FlickerlessValue, { value: s.value })]), ...Array.from({ length: s.rows }, (_, i) => h('p', { style: 'height:40px' }, `fila ${i}`))]),
      empty: () => h('p', { id: 'empty' }, 'VACIO'),
    }),
}).mount('#app');
