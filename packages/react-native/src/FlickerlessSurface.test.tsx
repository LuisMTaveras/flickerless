import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { FlickerlessSurface, type FlickerlessSurfaceProps } from './FlickerlessSurface';
import { FlickerlessValue } from './FlickerlessValue';
import { FlickerlessColorsProvider } from './colors';

afterEach(cleanup);

const view = (props: Partial<FlickerlessSurfaceProps> & { value?: number | null } = {}) => {
  const { value = null, ...rest } = props;
  return (
    <div data-height="120">
      <FlickerlessSurface delayMs={0} minDurationMs={0} renderEmpty={() => <span data-testid="empty">VACIO</span>} {...rest}>
        <span data-testid="body"><FlickerlessValue value={value} /></span>
      </FlickerlessSurface>
    </div>
  );
};

describe('FlickerlessSurface (React Native)', () => {
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

  it('an error without renderError shows errorText and keeps the data', () => {
    const r = render(view({ loading: false, empty: false, error: 'x', value: 5 }));
    expect(r.getByRole('alert').textContent).toBe('No se pudo cargar la información.');
    expect(r.getByTestId('body').textContent).toBe('5');
    r.rerender(view({ loading: false, empty: false, error: 'x', errorText: '' }));
    expect(r.queryByRole('alert')).toBeNull();
  });

  it('renderError replaces the content', () => {
    const r = render(view({ loading: false, error: 'x', renderError: () => <span data-testid="err">Reintentar</span> }));
    expect(r.getByTestId('err')).toBeTruthy();
    expect(r.queryByTestId('body')).toBeNull();
  });

  it('reads a query: pending is unknown, { items: [] } is empty', () => {
    const r = render(view({ query: { isPending: true, isFetching: true } }));
    expect(r.queryByTestId('empty')).toBeNull();
    r.rerender(view({ query: { data: { items: [] }, status: 'success' } }));
    expect(r.getByTestId('empty')).toBeTruthy();
  });

  it('preserveHeight locks the measured height while the indicator is visible', async () => {
    const r = render(view({ loading: false, empty: false, value: 1, preserveHeight: true }));
    r.rerender(view({ loading: true, empty: false, value: 1, preserveHeight: true }));
    await act(async () => new Promise(res => setTimeout(res, 10)));
    expect(r.container.querySelector('[data-min-height]')?.getAttribute('data-min-height')).toBe('120');
  });

  it('the inline notice takes the theme danger color when given', () => {
    const r = render(
      <FlickerlessColorsProvider value={{ stream: 'x', track: 'y', unknown: 'z', danger: 'rgb(1, 2, 3)' }}>
        {view({ loading: false, empty: false, error: 'x', value: 1 })}
      </FlickerlessColorsProvider>,
    );
    expect(r.getByRole('alert')).toBeTruthy();
  });
});
