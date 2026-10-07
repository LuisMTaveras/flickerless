import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FlickerlessController } from './controller';

function track(options: ConstructorParameters<typeof FlickerlessController>[0]) {
  const states: boolean[] = [];
  const controller = new FlickerlessController({
    ...options,
    onStateChange: ({ isVisibleLoading }) => states.push(isVisibleLoading),
  });
  return { controller, states };
}

describe('FlickerlessController', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance', 'Date'] });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('una carga más rápida que el umbral nunca enciende el indicador', () => {
    const { controller, states } = track({ loading: true, delayMs: 180 });
    vi.advanceTimersByTime(120);
    controller.update({ loading: false });
    vi.advanceTimersByTime(1000);
    expect(states).not.toContain(true);
    expect(controller.getIsVisibleLoading()).toBe(false);
  });

  it('una carga lenta lo enciende al pasar el umbral', () => {
    const { controller } = track({ loading: true, delayMs: 180 });
    vi.advanceTimersByTime(179);
    expect(controller.getIsVisibleLoading()).toBe(false);
    vi.advanceTimersByTime(1);
    expect(controller.getIsVisibleLoading()).toBe(true);
  });

  it('una vez encendido, dura al menos minDurationMs', () => {
    const { controller } = track({ loading: true, delayMs: 100, minDurationMs: 250 });
    vi.advanceTimersByTime(100);
    controller.update({ loading: false });
    expect(controller.getIsVisibleLoading()).toBe(true);
    vi.advanceTimersByTime(249);
    expect(controller.getIsVisibleLoading()).toBe(true);
    vi.advanceTimersByTime(1);
    expect(controller.getIsVisibleLoading()).toBe(false);
  });

  it('si ya pasó la duración mínima, se apaga en cuanto termina', () => {
    const { controller } = track({ loading: true, delayMs: 100, minDurationMs: 250 });
    vi.advanceTimersByTime(100 + 400);
    controller.update({ loading: false });
    expect(controller.getIsVisibleLoading()).toBe(false);
  });

  it('una recarga encadenada mientras sigue encendido no parpadea', () => {
    const { controller, states } = track({ loading: true, delayMs: 100, minDurationMs: 250 });
    vi.advanceTimersByTime(100);
    controller.update({ loading: false });
    vi.advanceTimersByTime(50);
    controller.update({ loading: true });
    vi.advanceTimersByTime(30);
    controller.update({ loading: false });
    vi.advanceTimersByTime(1000);
    expect(states).toEqual([true, false]);
  });

  it('el estado distingue error, carga y vacío', () => {
    const { controller } = track({ loading: false, empty: true });
    expect(controller.getStatus()).toBe('empty');
    controller.update({ error: 'falló' });
    expect(controller.getStatus()).toBe('error');
  });

  it('destroy cancela los temporizadores pendientes', () => {
    const { controller, states } = track({ loading: true, delayMs: 100 });
    controller.destroy();
    vi.advanceTimersByTime(1000);
    expect(states).toEqual([]);
  });
});
