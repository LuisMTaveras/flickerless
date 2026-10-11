// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { StrictMode } from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { FlickerlessSurface, type FlickerlessSurfaceProps } from './FlickerlessSurface';
import { FlickerlessValue } from './FlickerlessValue';

afterEach(cleanup);

const view = (props: Partial<FlickerlessSurfaceProps> & { value?: number | null } = {}) => {
  const { value = null, ...rest } = props;
  return (
    <StrictMode>
      <FlickerlessSurface delayMs={0} minDurationMs={0} emptyState={<p data-testid="empty">VACIO</p>} {...rest}>
        <p data-testid="body"><FlickerlessValue value={value} /></p>
      </FlickerlessSurface>
    </StrictMode>
  );
};

describe('FlickerlessSurface (React)', () => {
  it('does not claim «empty» on mount before any request', () => {
    const r = render(view({ loading: false, empty: true }));
    expect(r.queryByTestId('empty')).toBeNull();
    expect(r.getByTestId('body').textContent).toContain('—');
  });

  it('shows «empty» once a load finished empty', () => {
    const r = render(view({ loading: true, empty: true }));
    r.rerender(view({ loading: false, empty: true }));
    expect(r.getByTestId('empty').textContent).toBe('VACIO');
  });

  it('shows the bar while loading, also under StrictMode', async () => {
    const r = render(view({ loading: true, empty: true }));
    await act(async () => new Promise(res => setTimeout(res, 10)));
    expect(r.container.querySelector('.flickerless-surface')?.getAttribute('data-loading')).toBe('true');
  });

  it('never swallows an error without errorState; errorText="" turns it off', () => {
    const r = render(view({ loading: false, empty: false, error: 'x', value: 5 }));
    expect(r.getByRole('alert').textContent).toBe('No se pudo cargar la información.');
    expect(r.getByTestId('body').textContent).toBe('5');
    r.rerender(view({ loading: false, empty: false, error: 'x', errorText: '' }));
    expect(r.queryByRole('alert')).toBeNull();
  });

  it('reads a query: pending is unknown, { items: [] } is empty', () => {
    const r = render(view({ query: { isPending: true, isFetching: true } }));
    expect(r.queryByTestId('empty')).toBeNull();
    r.rerender(view({ query: { data: { items: [], totalCount: 0 }, status: 'success' } }));
    expect(r.getByTestId('empty')).toBeTruthy();
  });

  it('explicit props win over the query', () => {
    const r = render(view({ query: { data: { items: [] }, status: 'success' }, empty: false, value: 3 }));
    expect(r.getByTestId('body').textContent).toBe('3');
  });
});
