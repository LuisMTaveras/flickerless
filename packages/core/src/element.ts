import { FlickerlessController } from './controller.js';

const flag = (v: string | null) => v !== null && v !== 'false';
const ms = (v: string | null, fallback: number) => {
  const n = parseInt(v ?? '', 10);
  return Number.isNaN(n) ? fallback : n;
};

/**
 * `<flickerless-surface loading empty error="…" delay="180" min-duration="250" announce-text="…">`
 *
 * Light DOM: los hijos se mueven a `.flickerless-body` (también los que se añadan después),
 * así heredan los estilos de la página y se atenúan durante la recarga.
 * `error` presente (aunque vacío) es un error; `error="false"` no.
 */
export class FlickerlessElement extends HTMLElement {
  private controller: FlickerlessController | null = null;
  private bodyEl: HTMLDivElement | null = null;
  private statusEl: HTMLDivElement | null = null;
  private observer: MutationObserver | null = null;

  static get observedAttributes() {
    return ['loading', 'delay', 'min-duration', 'empty', 'error', 'announce-text'];
  }

  connectedCallback() {
    this.classList.add('flickerless-surface');
    this.setupDOM();

    this.controller = new FlickerlessController({
      loading: flag(this.getAttribute('loading')),
      delayMs: ms(this.getAttribute('delay'), 180),
      minDurationMs: ms(this.getAttribute('min-duration'), 250),
      empty: flag(this.getAttribute('empty')),
      error: this.readError(),
      onStateChange: ({ isVisibleLoading, status }) => this.reflect(isVisibleLoading, status),
    });
    // El controlador solo avisa de cambios: el estado de partida se escribe aquí.
    this.reflect(this.controller.getIsVisibleLoading(), this.controller.getStatus());

    // Lo que el framework o el usuario añadan después también va al cuerpo atenuado.
    this.observer = new MutationObserver(records => {
      for (const r of records) {
        r.addedNodes.forEach(node => {
          if (node !== this.bodyEl && node !== this.statusEl && !(node instanceof HTMLElement && node.classList.contains('flickerless-stream'))) {
            this.bodyEl?.appendChild(node);
          }
        });
      }
    });
    this.observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    this.controller?.destroy();
    this.controller = null;
    this.observer?.disconnect();
    this.observer = null;
  }

  attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null) {
    if (!this.controller) return;
    if (name === 'loading') this.controller.update({ loading: flag(newVal) });
    else if (name === 'empty') this.controller.update({ empty: flag(newVal) });
    else if (name === 'error') this.controller.update({ error: this.readError() });
    else if (name === 'delay') this.controller.update({ delayMs: ms(newVal, 180) });
    else if (name === 'min-duration') this.controller.update({ minDurationMs: ms(newVal, 250) });
    else if (name === 'announce-text') this.reflect(this.controller.getIsVisibleLoading(), this.controller.getStatus());
  }

  private readError(): string | boolean | null {
    const v = this.getAttribute('error');
    if (v === null || v === 'false') return null;
    return v || true;
  }

  private reflect(isVisibleLoading: boolean, status: string) {
    this.setAttribute('data-loading', isVisibleLoading ? 'true' : 'false');
    this.setAttribute('data-status', status);
    this.setAttribute('aria-busy', isVisibleLoading ? 'true' : 'false');
    if (this.statusEl) this.statusEl.textContent = isVisibleLoading ? (this.getAttribute('announce-text') ?? 'Actualizando…') : '';
  }

  private setupDOM() {
    const existing = this.querySelector<HTMLDivElement>(':scope > .flickerless-body');
    if (existing) {
      // Reconectado (movido en el DOM): ya tiene su estructura.
      this.bodyEl = existing;
      this.statusEl = this.querySelector<HTMLDivElement>(':scope > .flickerless-sr-only');
      return;
    }

    const statusEl = document.createElement('div');
    statusEl.className = 'flickerless-sr-only';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.setAttribute('aria-atomic', 'true');

    const streamEl = document.createElement('div');
    streamEl.className = 'flickerless-stream';
    streamEl.setAttribute('aria-hidden', 'true');

    const bodyEl = document.createElement('div');
    bodyEl.className = 'flickerless-body';
    while (this.firstChild) bodyEl.appendChild(this.firstChild);

    this.append(statusEl, streamEl, bodyEl);
    this.statusEl = statusEl;
    this.bodyEl = bodyEl;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('flickerless-surface')) {
  customElements.define('flickerless-surface', FlickerlessElement);
}
