// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import './element';

const tick = () => new Promise(r => setTimeout(r, 0));

describe('<flickerless-surface>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('writes its initial state and wraps its children', () => {
    document.body.innerHTML = '<flickerless-surface><p id="x">hola</p></flickerless-surface>';
    const el = document.querySelector('flickerless-surface')!;
    expect(el.getAttribute('data-status')).toBe('idle');
    expect(el.getAttribute('data-loading')).toBe('false');
    expect(el.querySelector('.flickerless-body #x')).not.toBeNull();
  });

  it('moves children added later into the dimmed body', async () => {
    document.body.innerHTML = '<flickerless-surface></flickerless-surface>';
    const el = document.querySelector('flickerless-surface')!;
    const p = document.createElement('p');
    el.appendChild(p);
    await tick();
    expect(p.parentElement?.className).toBe('flickerless-body');
  });

  it('an empty error attribute is an error; error="false" is not', () => {
    document.body.innerHTML = '<flickerless-surface error></flickerless-surface>';
    const el = document.querySelector('flickerless-surface')!;
    expect(el.getAttribute('data-status')).toBe('error');
    el.setAttribute('error', 'false');
    expect(el.getAttribute('data-status')).toBe('idle');
  });

  it('follows delay changes and announces the load', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<flickerless-surface delay="500" announce-text="Cargando"></flickerless-surface>';
    const el = document.querySelector('flickerless-surface')!;
    el.setAttribute('delay', '0');
    el.setAttribute('loading', '');
    expect(el.getAttribute('data-loading')).toBe('true');
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.querySelector('[role=status]')?.textContent).toBe('Cargando');
  });

  it('keeps one structure when moved in the DOM', () => {
    document.body.innerHTML = '<div id="a"><flickerless-surface><p>x</p></flickerless-surface></div><div id="b"></div>';
    const el = document.querySelector('flickerless-surface')!;
    document.getElementById('b')!.appendChild(el);
    expect(el.querySelectorAll(':scope > .flickerless-body').length).toBe(1);
    expect(el.querySelectorAll(':scope > .flickerless-stream').length).toBe(1);
  });
});
