import { FlickerlessController } from './controller';

export class FlickerlessElement extends HTMLElement {
  private controller!: FlickerlessController;
  private streamEl!: HTMLDivElement;
  private bodyEl!: HTMLDivElement;

  static get observedAttributes() {
    return ['loading', 'initial-loading', 'delay', 'min-duration', 'empty', 'error'];
  }

  connectedCallback() {
    this.classList.add('flickerless-surface');
    this.setupDOM();

    const delay = parseInt(this.getAttribute('delay') || '180', 10);
    const minDuration = parseInt(this.getAttribute('min-duration') || '250', 10);
    const loading = this.hasAttribute('loading') && this.getAttribute('loading') !== 'false';
    const empty = this.hasAttribute('empty') && this.getAttribute('empty') !== 'false';
    const error = this.getAttribute('error');

    this.controller = new FlickerlessController({
      loading,
      delayMs: isNaN(delay) ? 180 : delay,
      minDurationMs: isNaN(minDuration) ? 250 : minDuration,
      empty,
      error: error || null,
      onStateChange: ({ isVisibleLoading, status }) => {
        this.setAttribute('data-loading', isVisibleLoading ? 'true' : 'false');
        this.setAttribute('data-status', status);
      },
    });
  }

  disconnectedCallback() {
    if (this.controller) {
      this.controller.destroy();
    }
  }

  attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null) {
    if (!this.controller) return;

    if (name === 'loading') {
      const loading = newVal !== null && newVal !== 'false';
      this.controller.update({ loading });
    } else if (name === 'empty') {
      this.controller.update({ empty: newVal !== null && newVal !== 'false' });
    } else if (name === 'error') {
      this.controller.update({ error: newVal });
    }
  }

  private setupDOM() {
    if (this.querySelector(':scope > .flickerless-stream')) return;

    this.streamEl = document.createElement('div');
    this.streamEl.className = 'flickerless-stream';

    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'flickerless-body';

    while (this.firstChild) {
      this.bodyEl.appendChild(this.firstChild);
    }

    this.appendChild(this.streamEl);
    this.appendChild(this.bodyEl);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('flickerless-surface')) {
  customElements.define('flickerless-surface', FlickerlessElement);
}
