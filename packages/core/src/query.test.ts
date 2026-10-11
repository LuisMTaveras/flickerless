import { describe, expect, it } from 'vitest';
import { isEmptyValue, readQueryState } from './query';

describe('isEmptyValue', () => {
  it('reads the list inside a page, not its keys', () => {
    expect(isEmptyValue({ items: [], totalCount: 0 })).toBe(true);
    expect(isEmptyValue({ edges: [{ node: 1 }], pageInfo: {} })).toBe(false);
    expect(isEmptyValue([])).toBe(true);
    expect(isEmptyValue({})).toBe(true);
    expect(isEmptyValue({ id: 1 })).toBe(false);
    expect(isEmptyValue(0)).toBe(false);
    expect(isEmptyValue(undefined)).toBe(true);
  });
});

describe('readQueryState', () => {
  it('is not settled until the query answers', () => {
    expect(readQueryState({ isPending: true, isFetching: true }).settled).toBe(false);
    expect(readQueryState({ data: { items: [] }, status: 'success' })).toMatchObject({ settled: true, isEmpty: true, loading: false });
  });
  it('a refetch with data is not an initial load', () => {
    expect(readQueryState({ data: [1], isFetching: true })).toMatchObject({ loading: true, isInitialLoading: false, isRefetching: true });
  });
  it('tolerates no query', () => {
    expect(readQueryState(null)).toMatchObject({ loading: false, settled: false, error: null });
  });
});
