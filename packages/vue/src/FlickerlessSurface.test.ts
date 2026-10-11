// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { FlickerlessSurface } from './FlickerlessSurface';
import { FlickerlessValue } from './FlickerlessValue';

function harness(extra: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const loading = ref(false);
  const empty = ref(true);
  const error = ref<string | null>(null);
  const value = ref<number | null>(null);
  const query = ref<Record<string, unknown> | null>(null);
  const Comp = defineComponent({
    setup: () => () =>
      h(
        FlickerlessSurface,
        { loading: loading.value, empty: empty.value, error: error.value, query: query.value, delayMs: 0, minDurationMs: 0, ...extra },
        { default: () => h('p', { class: 'body' }, [h(FlickerlessValue, { value: value.value })]), empty: () => h('p', { class: 'empty' }, 'VACIO'), ...slots },
      ),
  });
  return { wrapper: mount(Comp), loading, empty, error, value, query };
}

describe('FlickerlessSurface (Vue)', () => {
  it('does not claim «empty» on mount before any request', () => {
    const { wrapper } = harness();
    expect(wrapper.find('.empty').exists()).toBe(false);
    expect(wrapper.find('.body').text()).toContain('—');
  });

  it('shows «empty» once a load finished empty', async () => {
    const { wrapper, loading } = harness();
    loading.value = true;
    await nextTick();
    loading.value = false;
    await nextTick();
    expect(wrapper.find('.empty').text()).toBe('VACIO');
  });

  it('a value with data already on mount is settled', async () => {
    const { wrapper, empty, value } = harness();
    empty.value = false;
    value.value = 5;
    await nextTick();
    expect(wrapper.find('.body').text()).toBe('5');
  });

  it('never swallows an error without #error; error-text="" turns the notice off', async () => {
    const a = harness();
    a.error.value = 'x';
    await nextTick();
    expect(a.wrapper.find('[role=alert]').text()).toBe('No se pudo cargar la información.');
    const b = harness({ errorText: '' });
    b.error.value = 'x';
    await nextTick();
    expect(b.wrapper.find('[role=alert]').exists()).toBe(false);
  });

  it('the #error slot replaces the content', async () => {
    const { wrapper, error } = harness({}, { error: () => h('p', { class: 'err' }, 'Reintentar') });
    error.value = 'x';
    await nextTick();
    expect(wrapper.find('.err').exists()).toBe(true);
    expect(wrapper.find('.body').exists()).toBe(false);
  });

  it('follows a replaced :query and reads { items: [] } as empty', async () => {
    const { wrapper, query } = harness();
    query.value = { data: undefined, isPending: true, isFetching: true };
    await nextTick();
    expect(wrapper.find('.empty').exists()).toBe(false);
    query.value = { data: { items: [], totalCount: 0 }, isPending: false, isFetching: false, status: 'success' };
    await nextTick();
    expect(wrapper.find('.empty').exists()).toBe(true);
  });
});

describe('FlickerlessSurface (Vue) with data and a failed reload', () => {
  it('keeps showing the data it has', async () => {
    const { wrapper, empty, value, error } = harness();
    empty.value = false;
    value.value = 7;
    error.value = 'x';
    await nextTick();
    expect(wrapper.find('.body').text()).toBe('7');
    expect(wrapper.find('[role=alert]').exists()).toBe(true);
  });
});
