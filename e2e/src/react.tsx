import '@flickerless/core/styles.css';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FlickerlessSurface, FlickerlessValue, type FlickerlessSurfaceProps } from '@flickerless/react';

type S = { loading: boolean; empty: boolean; error: string | null; value: number | null; rows: number; query?: FlickerlessSurfaceProps['query'] };
function App() {
  const [s, setS] = useState<S>({ loading: false, empty: true, error: null, value: null, rows: 3 });
  Object.assign(window, { set: (p: Partial<S>) => setS(o => ({ ...o, ...p })) });
  return (
    <FlickerlessSurface className="surface" loading={s.query ? undefined : s.loading} empty={s.query ? undefined : s.empty} error={s.query ? undefined : s.error} query={s.query} preserveHeight delayMs={0} minDurationMs={0} emptyState={<p id="empty">VACIO</p>}>
      <div id="body">
        <p><FlickerlessValue value={s.value} /></p>
        {Array.from({ length: s.rows }, (_, i) => <p key={i} style={{ height: 40 }}>fila {i}</p>)}
      </div>
    </FlickerlessSurface>
  );
}
createRoot(document.getElementById('app')!).render(<StrictMode><App /></StrictMode>);
