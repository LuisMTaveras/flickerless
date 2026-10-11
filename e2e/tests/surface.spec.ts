import { expect, test, type Page } from '@playwright/test';

// Las mismas reglas en Vue y React, en un navegador real (alturas, CSS y StrictMode incluidos).
type Patch = Record<string, unknown>;
const adapters = {
  vue: (page: Page, p: Patch) => page.evaluate(q => Object.assign((window as any).s, q), p),
  react: (page: Page, p: Patch) => page.evaluate(q => (window as any).set(q), p),
};

for (const [name, set] of Object.entries(adapters)) {
  test.describe(name, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${name}.html`);
      await expect(page.locator('.flickerless-surface')).toBeVisible();
    });

    test('mount: «—», never «empty» before the first answer', async ({ page }) => {
      await expect(page.locator('#body')).toContainText('—');
      await expect(page.locator('#empty')).toHaveCount(0);
    });

    test('a finished empty load shows the empty state', async ({ page }) => {
      await set(page, { loading: true });
      await expect(page.locator('.flickerless-surface')).toHaveAttribute('data-loading', 'true');
      await set(page, { loading: false });
      await expect(page.locator('#empty')).toHaveText('VACIO');
    });

    test('data, then a failed reload: data stays and the notice shows', async ({ page }) => {
      await set(page, { empty: false, value: 5 });
      await expect(page.locator('#body p').first()).toHaveText('5');
      await set(page, { error: 'x' });
      await expect(page.getByRole('alert')).toHaveText('No se pudo cargar la información.');
      await expect(page.locator('#body p').first()).toHaveText('5');
    });

    test('preserveHeight: the surface keeps its height while reloading with fewer rows', async ({ page }) => {
      await set(page, { empty: false, value: 1, rows: 6 });
      const before = await page.locator('.flickerless-surface').evaluate(e => e.getBoundingClientRect().height);
      await set(page, { loading: true });
      await expect(page.locator('.flickerless-surface')).toHaveAttribute('data-loading', 'true');
      await set(page, { rows: 1 });
      const during = await page.locator('.flickerless-surface').evaluate(e => e.getBoundingClientRect().height);
      expect(during).toBeGreaterThanOrEqual(before - 1);
      await set(page, { loading: false });
      await expect.poll(() => page.locator('.flickerless-surface').evaluate(e => e.getBoundingClientRect().height)).toBeLessThan(before);
    });

    test('query: pending is unknown, { items: [] } is empty', async ({ page }) => {
      await set(page, { query: { isPending: true, isFetching: true } });
      await expect(page.locator('#empty')).toHaveCount(0);
      await set(page, { query: { data: { items: [], totalCount: 0 }, status: 'success' } });
      await expect(page.locator('#empty')).toHaveText('VACIO');
    });
  });
}

test.describe('web component', () => {
  test('state, late children, error attribute and announcement', async ({ page }) => {
    await page.goto('/element.html');
    const el = page.locator('flickerless-surface');
    await expect(el).toHaveAttribute('data-status', 'idle');
    await expect(page.locator('.flickerless-body #first')).toHaveCount(1);
    await page.evaluate(() => document.querySelector('flickerless-surface')!.insertAdjacentHTML('beforeend', '<p id="late">tarde</p>'));
    await expect(page.locator('.flickerless-body #late')).toHaveCount(1);
    await el.evaluate(e => e.setAttribute('loading', ''));
    await expect(el).toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('flickerless-surface [role=status]')).toHaveText('Cargando');
    await expect(page.locator('.flickerless-body')).toHaveCSS('opacity', '0.52');
    await el.evaluate(e => { e.removeAttribute('loading'); e.setAttribute('error', ''); });
    await expect(el).toHaveAttribute('data-status', 'error');
  });
});
