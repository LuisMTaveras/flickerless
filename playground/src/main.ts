import '../../packages/core/src/element';
import { MOCK_INVOICES, Invoice } from './mockData';

// State
let currentTab: string = 'Todas';
let searchKeyword: string = '';
let latencyMs: number = 320;
let mode: 'flickerless' | 'legacy' = 'flickerless';
let isMobileView: boolean = false;
let isLoading: boolean = false;
let currentInvoices: Invoice[] = [...MOCK_INVOICES];

const app = document.getElementById('app')!;

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(val);
}

function getFilteredInvoices(): Invoice[] {
  return MOCK_INVOICES.filter((inv) => {
    const matchesTab =
      currentTab === 'Todas' ||
      (currentTab === 'Borradores' && inv.status === 'Borrador') ||
      (currentTab === 'Emitidas' && inv.status === 'Emitida') ||
      (currentTab === 'Rechazadas DGII' && inv.status === 'Rechazada DGII') ||
      (currentTab === 'Anuladas' && inv.status === 'Anulada');

    const matchesSearch =
      !searchKeyword ||
      inv.number.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      inv.client.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      inv.ncf.toLowerCase().includes(searchKeyword.toLowerCase());

    return matchesTab && matchesSearch;
  });
}

function triggerFetch() {
  isLoading = true;
  updateUIState();

  setTimeout(() => {
    currentInvoices = getFilteredInvoices();
    isLoading = false;
    updateUIState();
  }, latencyMs);
}

function updateUIState() {
  const surface = document.getElementById('main-surface');
  if (surface) {
    if (isLoading) {
      surface.setAttribute('loading', 'true');
    } else {
      surface.removeAttribute('loading');
    }
  }

  // Update counters
  const totalCount = document.getElementById('count-total');
  if (totalCount) {
    totalCount.textContent = isLoading && mode === 'legacy' ? '0' : String(currentInvoices.length);
  }

  renderBody();
}

function render() {
  app.innerHTML = `
    <header class="max-w-6xl mx-auto mb-8">
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Open Source</span>
            <span class="text-xs text-zinc-500 font-mono">v0.1.0</span>
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-zinc-50 mt-1">Flickerless</h1>
          <p class="text-zinc-400 text-sm mt-1">The zero-flicker, layout-stable data loading surface. The calm alternative to skeleton fatigue.</p>
        </div>

        <div class="flex items-center gap-3">
          <button id="toggle-mode-btn" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg border ${mode === 'flickerless' ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-amber-950/40 border-amber-800/60 text-amber-300'} transition cursor-pointer">
            Modo: ${mode === 'flickerless' ? '✨ Flickerless (Nuevo)' : '⚠️ Skeleton Antiguo'}
          </button>
          <button id="toggle-view-btn" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition cursor-pointer">
            📱 ${isMobileView ? 'Ver Pantalla Completa' : 'Ver Modo Móvil'}
          </button>
        </div>
      </div>

      <!-- Controls toolbar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs">
        <div>
          <label class="block text-zinc-400 font-medium mb-1">Simular Latencia de API: <span id="latency-label" class="text-zinc-200 font-mono font-bold">${latencyMs} ms</span></label>
          <input id="latency-slider" type="range" min="50" max="1500" step="50" value="${latencyMs}" class="w-full accent-blue-500 cursor-pointer">
          <p class="text-[11px] text-zinc-500 mt-1">Nota: Si la API responde en &lt;180ms, Flickerless nunca parpadea.</p>
        </div>

        <div>
          <label class="block text-zinc-400 font-medium mb-1">Buscar comprobante</label>
          <input id="search-input" type="text" placeholder="Buscar por número, NCF o cliente..." value="${searchKeyword}" class="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs">
        </div>

        <div class="flex items-end">
          <button id="refresh-btn" class="w-full py-1.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition cursor-pointer flex items-center justify-center gap-2">
            <span>⟳ Disparar Recarga</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="max-w-6xl mx-auto transition-all ${isMobileView ? 'max-w-md' : ''}">
      <div class="bg-zinc-900/40 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
        
        <!-- Tabs & Actions Bar -->
        <div class="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-1.5" id="tabs-container">
            ${['Todas', 'Borradores', 'Emitidas', 'Rechazadas DGII', 'Anuladas'].map(tab => `
              <button data-tab="${tab}" class="tab-btn px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${currentTab === tab ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}">
                ${tab}
              </button>
            `).join('')}
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-zinc-500">Total: <strong id="count-total" class="text-zinc-300 font-mono">${currentInvoices.length}</strong></span>
            <button class="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white font-semibold transition cursor-pointer">+ Nueva Factura</button>
          </div>
        </div>

        <!-- The Surface -->
        <flickerless-surface id="main-surface" delay="180">
          <div id="table-body-container"></div>
        </flickerless-surface>

        <!-- Footer -->
        <div class="p-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Mostrando <span class="font-mono text-zinc-300">${currentInvoices.length}</span> registros</span>
          <span class="text-[11px] font-mono text-zinc-600">Zero-CLS Verified</span>
        </div>
      </div>
    </main>
  `;

  attachEvents();
  renderBody();
}

function attachEvents() {
  document.getElementById('toggle-mode-btn')?.addEventListener('click', () => {
    mode = mode === 'flickerless' ? 'legacy' : 'flickerless';
    render();
  });

  document.getElementById('toggle-view-btn')?.addEventListener('click', () => {
    isMobileView = !isMobileView;
    render();
  });

  const slider = document.getElementById('latency-slider') as HTMLInputElement;
  slider?.addEventListener('input', (e) => {
    latencyMs = parseInt((e.target as HTMLInputElement).value, 10);
    document.getElementById('latency-label')!.textContent = `${latencyMs} ms`;
  });

  const search = document.getElementById('search-input') as HTMLInputElement;
  search?.addEventListener('input', (e) => {
    searchKeyword = (e.target as HTMLInputElement).value;
    triggerFetch();
  });

  document.getElementById('refresh-btn')?.addEventListener('click', () => {
    triggerFetch();
  });

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      currentTab = (e.currentTarget as HTMLElement).getAttribute('data-tab') || 'Todas';
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.className = 'tab-btn px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900';
      });
      (e.currentTarget as HTMLElement).className = 'tab-btn px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer bg-zinc-800 text-zinc-100 shadow-sm';
      triggerFetch();
    });
  });
}

function renderBody() {
  const container = document.getElementById('table-body-container');
  if (!container) return;

  if (mode === 'legacy' && isLoading) {
    // Legacy skeleton pills (The flickering sausage problem)
    container.innerHTML = `
      <div class="p-4 space-y-4">
        ${[1, 2, 3, 4, 5].map(() => `
          <div class="grid grid-cols-6 gap-3 items-center">
            <div class="legacy-pill w-20"></div>
            <div class="legacy-pill w-36"></div>
            <div class="legacy-pill w-28"></div>
            <div class="legacy-pill w-20"></div>
            <div class="legacy-pill w-24"></div>
            <div class="legacy-pill w-16"></div>
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  if (currentInvoices.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-zinc-500">
        <p class="text-sm">No se encontraron facturas con los filtros seleccionados.</p>
      </div>
    `;
    return;
  }

  if (isMobileView) {
    // Mobile Card View
    container.innerHTML = `
      <div class="p-3 space-y-3">
        ${currentInvoices.map(inv => `
          <div class="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-semibold text-zinc-200">${inv.number}</span>
              <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full ${getStatusBadgeClass(inv.status)}">${inv.status}</span>
            </div>
            <div class="text-xs font-medium text-zinc-300">${inv.client}</div>
            <div class="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-900">
              <span class="font-mono">${inv.ncf}</span>
              <span class="font-mono font-bold text-zinc-100">${formatCurrency(inv.total)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  // Desktop Table View
  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold text-[11px] bg-zinc-950/40">
          <tr>
            <th class="py-3 px-4 w-10"><input type="checkbox" class="rounded accent-zinc-700"></th>
            <th class="py-3 px-4">Factura</th>
            <th class="py-3 px-4">Cliente</th>
            <th class="py-3 px-4">Comprobante</th>
            <th class="py-3 px-4">Vencimiento</th>
            <th class="py-3 px-4 text-right">Total</th>
            <th class="py-3 px-4 text-right">Saldo</th>
            <th class="py-3 px-4 text-center">Estado</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
          ${currentInvoices.map(inv => `
            <tr class="hover:bg-zinc-800/30 transition">
              <td class="py-3 px-4"><input type="checkbox" class="rounded accent-zinc-700"></td>
              <td class="py-3 px-4 font-mono font-semibold text-zinc-200">${inv.number}</td>
              <td class="py-3 px-4">
                <div class="font-medium text-zinc-200">${inv.client}</div>
                <div class="text-[10px] text-zinc-500 font-mono">${inv.clientRnc}</div>
              </td>
              <td class="py-3 px-4 font-mono text-zinc-400">${inv.ncf}</td>
              <td class="py-3 px-4 text-zinc-400">${inv.dueDate}</td>
              <td class="py-3 px-4 text-right font-mono font-semibold text-zinc-200">${formatCurrency(inv.total)}</td>
              <td class="py-3 px-4 text-right font-mono ${inv.balance > 0 ? 'text-amber-400' : 'text-zinc-500'}">${formatCurrency(inv.balance)}</td>
              <td class="py-3 px-4 text-center">
                <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadgeClass(inv.status)}">
                  ${inv.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function getStatusBadgeClass(status: Invoice['status']): string {
  switch (status) {
    case 'Emitida':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'Borrador':
      return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    case 'Rechazada DGII':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    case 'Anulada':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  }
}

render();
