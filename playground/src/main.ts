import { MOCK_INVOICES, Invoice } from './mockData';

// State
type ViewState = 'shimmer' | 'loaded';
type ActiveSection = 'table' | 'dashboard';

let viewState: ViewState = 'shimmer';
let activeSection: ActiveSection = 'dashboard';
let currentTab: string = 'Todas';
let searchKeyword: string = '';
let isDarkTheme: boolean = false;
let shimmerSpeed: number = 2.0; // seconds
let activeBarColor: string = '#3b82f6';
let isSimulatingFetch: boolean = false;

const app = document.getElementById('app')!;

const SKELETON_ROWS = [
  { id: '1', code: 'INVOICE 600', clientTitle: 'Avatar Avatar', clientSub: 'Primary dy subtext', ncf: 'HOMPR780AASE', date: '29 nov', total: '$1,609.00', balance: '$$50.00' },
  { id: '2', code: 'INVOICE 682', clientTitle: 'Avatar Avatar', clientSub: 'Primary dy subtext', ncf: 'HOMPR780AASE', date: '28 jun', total: '$1,369.00', balance: '$$50.00' },
  { id: '3', code: 'INVOICE 974', clientTitle: 'Avatar Avatar', clientSub: 'Primary dy subtext', ncf: 'HOMPR200RASE', date: '20 mar', total: '$1,469.00', balance: '-$$0.00' },
  { id: '4', code: 'INVOICE 976', clientTitle: 'Avatar Avatar', clientSub: 'Secondary subtext', ncf: 'HOMPR20BRASE', date: '28 mar', total: '$1,489.00', balance: '-$$0.00' },
  { id: '5', code: 'INVOICE 982', clientTitle: 'Avatar Avatar', clientSub: 'Secondary subtext', ncf: 'HOMPR2DBRASE', date: '3 nov', total: '$1,780.00', balance: '-$$0.00' },
  { id: '6', code: 'INVOICE 984', clientTitle: 'Avatar Avatar', clientSub: 'Primarydary subtext', ncf: 'HOMPR6DBRASE', date: '3 nov', total: '$1,200.00', balance: '-$$0.00' },
  { id: '7', code: 'INVOICE 936', clientTitle: 'Avatar Avatar', clientSub: 'Primarydary subtext', ncf: 'HOMPR6DBPASE', date: '6 nov', total: '$800.00', balance: '-$$0.00' },
];

const MONTHLY_DATA = [
  { month: 'Ene', heightPct: 65, value: 184500 },
  { month: 'Feb', heightPct: 85, value: 245000 },
  { month: 'Mar', heightPct: 40, value: 115000 },
  { month: 'Abr', heightPct: 92, value: 275000 },
  { month: 'May', heightPct: 70, value: 198000 },
  { month: 'Jun', heightPct: 88, value: 260000 },
  { month: 'Jul', heightPct: 58, value: 165000 },
  { month: 'Ago', heightPct: 76, value: 220000 },
];

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

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  if (isDarkTheme) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  render();
}

function setShimmerSpeed(speed: number) {
  shimmerSpeed = speed;
  document.documentElement.style.setProperty('--shimmer-duration', `${speed}s`);
  render();
}

function setBarColor(color: string) {
  activeBarColor = color;
  document.documentElement.style.setProperty('--flickerless-stream-color', color);
  document.documentElement.style.setProperty('--flickerless-stream-bg', `${color}25`);
  render();
}

function triggerSimulatedFetch() {
  if (isSimulatingFetch) return;
  isSimulatingFetch = true;
  viewState = 'shimmer';
  render();

  setTimeout(() => {
    isSimulatingFetch = false;
    viewState = 'loaded';
    render();
  }, 1800);
}

function render() {
  const isShimmer = viewState === 'shimmer';

  app.innerHTML = `
    <!-- Ambient Backdrop -->
    <div class="ambient-glow"></div>
    <div class="ambient-grid"></div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      
      <!-- Top Bar: Title & Live Controls -->
      <header class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              GPU Shimmer Architecture
            </span>
            <span class="text-xs font-mono text-zinc-500">Tablas + Gráficos en CSS Puro</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>✨ Carga de Tablas y Gráficos (Shimmer Wave)</span>
          </h1>
          <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Haz de luz continuo diagonal (110°), barra lineal de 2px y siluetas proporcionales tanto para tablas como para gráficos de analítica.
          </p>
        </div>

        <!-- Toolbar Buttons -->
        <div class="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <!-- View State Switcher -->
          <div class="flex items-center p-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-800 text-xs font-semibold">
            <button id="btn-state-shimmer" class="px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${isShimmer ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Animación Shimmer</span>
            </button>
            <button id="btn-state-loaded" class="px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${!isShimmer ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}">
              <span>Datos Reales</span>
            </button>
          </div>

          <!-- Simulate API Fetch -->
          <button id="btn-simulate-fetch" class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer shadow-sm shadow-blue-500/25 flex items-center gap-1.5 ${isSimulatingFetch ? 'opacity-70 cursor-wait' : ''}">
            <svg class="w-3.5 h-3.5 ${isSimulatingFetch ? 'animate-spin' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            <span>${isSimulatingFetch ? 'Cargando...' : 'Simular Recarga API'}</span>
          </button>

          <!-- Theme Toggle -->
          <button id="btn-theme-toggle" title="Cambiar tema claro / oscuro" class="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition cursor-pointer shadow-sm">
            ${isDarkTheme ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <!-- View Selector (Dashboard con Gráficos vs Solo Tabla) & Controls -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm text-xs">
        <div class="flex items-center gap-2">
          <span class="font-bold text-zinc-700 dark:text-zinc-300">Mostrar:</span>
          <div class="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-semibold">
            <button id="tab-section-dashboard" class="px-3 py-1 rounded-lg transition cursor-pointer ${activeSection === 'dashboard' ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}">
              📊 Gráficos + Tabla (Dashboard)
            </button>
            <button id="tab-section-table" class="px-3 py-1 rounded-lg transition cursor-pointer ${activeSection === 'table' ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}">
              📋 Solo Tabla
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5 font-mono">
            <span class="text-zinc-500">Velocidad:</span>
            ${[
              { sec: 1.4, label: '1.4s' },
              { sec: 2.0, label: '2.0s' },
              { sec: 2.8, label: '2.8s' }
            ].map(s => `
              <button data-speed="${s.sec}" class="speed-btn px-2 py-0.5 rounded text-[11px] transition cursor-pointer ${shimmerSpeed === s.sec ? 'bg-blue-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}">
                ${s.label}
              </button>
            `).join('')}
          </div>

          <div class="flex items-center gap-1.5">
            ${[
              { hex: '#3b82f6', label: 'Azul' },
              { hex: '#8b5cf6', label: 'Violeta' },
              { hex: '#10b981', label: 'Verde' },
              { hex: '#f59e0b', label: 'Ámbar' }
            ].map(c => `
              <button data-color="${c.hex}" title="${c.label}" class="color-btn w-4 h-4 rounded-full transition cursor-pointer border ${activeBarColor === c.hex ? 'border-zinc-900 dark:border-white scale-110 shadow-sm ring-2 ring-blue-500/30' : 'border-transparent opacity-75 hover:opacity-100'}" style="background-color: ${c.hex};"></button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT AREA -->
      <main class="space-y-6">
        
        <!-- ============================================================== -->
        <!-- CHARTS SECTION (WHEN ACTIVE) -->
        <!-- ============================================================== -->
        ${activeSection === 'dashboard' ? `
          <!-- KPI Summary Metrics -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            ${renderKPICards(isShimmer)}
          </div>

          <!-- Charts Grid: Bar Chart + Area Sparkline -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left: Bar Chart (Facturación Mensual) -->
            <div class="lg:col-span-7 ref-card overflow-hidden">
              <div class="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Facturación Mensual (DOP)</h3>
                  <p class="text-[11px] text-zinc-500">Volumen emitido en los últimos 8 meses</p>
                </div>
                <span class="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">Año 2026</span>
              </div>
              
              <!-- 2px Linear Stream Bar -->
              <div class="linear-stream-track">
                <div class="linear-stream-bar"></div>
              </div>

              <!-- Bar Chart Surface -->
              <div class="p-6 ${isShimmer ? 'shimmer-sweep-surface' : ''}">
                ${renderBarChart(isShimmer)}
              </div>
            </div>

            <!-- Right: Area Trend Chart (Cobros & Recuperación) -->
            <div class="lg:col-span-5 ref-card overflow-hidden">
              <div class="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Tendencia de Cobros</h3>
                  <p class="text-[11px] text-zinc-500">Tasa de recuperación y saldos</p>
                </div>
                <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">+14.2%</span>
              </div>

              <!-- 2px Linear Stream Bar -->
              <div class="linear-stream-track">
                <div class="linear-stream-bar"></div>
              </div>

              <!-- Area Curve Surface -->
              <div class="p-6 ${isShimmer ? 'shimmer-sweep-surface' : ''}">
                ${renderAreaChart(isShimmer)}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- ============================================================== -->
        <!-- TABLE CONTAINER (INVOICES - FIEL A LA IMAGEN) -->
        <!-- ============================================================== -->
        <div class="ref-card overflow-hidden">
          
          <!-- Navigation Tabs Bar -->
          <div class="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              ${[
                { name: 'Todas', count: 1 },
                { name: 'Borradores', count: 3 },
                { name: 'Emitidas', count: 3 },
                { name: 'Rechazadas DGII', count: 1 },
                { name: 'Anuladas', count: 0 },
              ].map(tab => {
                const isActive = currentTab === tab.name;
                return `
                  <button data-tab="${tab.name}" class="tab-btn px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-2 ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}">
                    <span>${tab.name}</span>
                    <span class="px-1.5 py-0.2 text-[10px] font-mono rounded-full ${isActive ? 'bg-blue-200/70 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}">
                      ${tab.count}
                    </span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- New Invoice CTA Button -->
            <button class="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm">
              <span class="text-sm font-light">+</span>
              <span>Nueva factura</span>
            </button>
          </div>

          <!-- Search Bar & Filters Toolbar -->
          <div class="p-4 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-2 sm:gap-3 bg-zinc-50/50 dark:bg-zinc-950/30">
            <div class="relative flex-1 min-w-[240px]">
              <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input id="search-input" type="text" placeholder="Buscar por número, NCF o cliente..." value="${searchKeyword}" class="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 transition shadow-sm">
            </div>

            <!-- Filter Dropdown Pills -->
            <button class="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition cursor-pointer shadow-sm">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </button>

            <button class="px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition cursor-pointer flex items-center gap-1 shadow-sm">
              <span>Fecha</span>
              <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            <button class="px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition cursor-pointer flex items-center gap-1 shadow-sm">
              <span>Estado</span>
              <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>

          <!-- Table Column Headers -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="text-zinc-600 dark:text-zinc-400 font-bold text-[12px] bg-zinc-50/70 dark:bg-zinc-950/50">
                  <th class="py-3.5 px-4 w-12 text-center">
                    <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 accent-blue-600 cursor-pointer">
                  </th>
                  <th class="py-3.5 px-4 font-semibold">Factura</th>
                  <th class="py-3.5 px-4 font-semibold">Cliente</th>
                  <th class="py-3.5 px-4 font-semibold">Comprobante</th>
                  <th class="py-3.5 px-4 font-semibold">Vencimiento</th>
                  <th class="py-3.5 px-4 text-right font-semibold">Total</th>
                  <th class="py-3.5 px-4 text-right font-semibold">Saldo</th>
                  <th class="py-3.5 px-4 text-center font-semibold">Estado</th>
                </tr>
              </thead>
            </table>
          </div>

          <!-- 2px Glowing Linear Progress Stream Line under the header -->
          <div class="linear-stream-track">
            <div class="linear-stream-bar"></div>
          </div>

          <!-- Table Body: Shimmer Wave or Real Invoices -->
          <div class="${isShimmer ? 'shimmer-sweep-surface' : ''} overflow-x-auto transition-opacity duration-200">
            ${isShimmer ? renderShimmerTable() : renderLoadedTable(getFilteredInvoices())}
          </div>

        </div>

      </main>

      <!-- Architectural Insights for Charts -->
      <section class="mt-8 p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs">
        <div class="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-2">
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <span>¿Cómo funciona la carga en gráficos?</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
          <div class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
            <div class="font-semibold text-zinc-900 dark:text-zinc-200 text-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              1. Siluetas Proporcionales
            </div>
            <p class="text-[11px]">En vez de un bloque gris muerto, las barras y curvas tienen alturas variadas y líneas de cuadrícula para que el usuario anticipe la escala.</p>
          </div>
          <div class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
            <div class="font-semibold text-zinc-900 dark:text-zinc-200 text-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
              2. Haz de Luz Diagonal Unificado
            </div>
            <p class="text-[11px]">La animación de 110° viaja por todas las barras como una sola superficie reflectante, eliminando el parpadeo inconexo.</p>
          </div>
          <div class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
            <div class="font-semibold text-zinc-900 dark:text-zinc-200 text-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              3. Cero Salto de Layout (0.00 CLS)
            </div>
            <p class="text-[11px]">El contenedor del gráfico reserva exactamente la misma altura (ej. 220px) antes y después de que llegue la respuesta del servidor.</p>
          </div>
        </div>
      </section>

    </div>
  `;

  attachEventListeners();
}

function renderKPICards(isShimmer: boolean): string {
  if (isShimmer) {
    return `
      <div class="p-5 ref-card relative overflow-hidden shimmer-sweep-surface space-y-3">
        <div class="linear-stream-track absolute top-0 left-0 right-0"><div class="linear-stream-bar"></div></div>
        <div class="sk-title w-24"></div>
        <div class="sk-title w-36 h-6"></div>
        <div class="sk-subtext w-20"></div>
      </div>

      <div class="p-5 ref-card relative overflow-hidden shimmer-sweep-surface space-y-3">
        <div class="linear-stream-track absolute top-0 left-0 right-0"><div class="linear-stream-bar"></div></div>
        <div class="sk-title w-28"></div>
        <div class="sk-title w-36 h-6"></div>
        <div class="sk-subtext w-24"></div>
      </div>

      <div class="p-5 ref-card relative overflow-hidden shimmer-sweep-surface space-y-3">
        <div class="linear-stream-track absolute top-0 left-0 right-0"><div class="linear-stream-bar"></div></div>
        <div class="sk-title w-24"></div>
        <div class="sk-title w-28 h-6"></div>
        <div class="sk-subtext w-16"></div>
      </div>
    `;
  }

  return `
    <div class="p-5 ref-card space-y-1">
      <div class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Facturación Total</div>
      <div class="text-xl font-extrabold font-mono text-zinc-900 dark:text-white">$1,114,890.50</div>
      <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
        <span>↑ +18.4%</span>
        <span class="text-zinc-400">vs mes anterior</span>
      </div>
    </div>

    <div class="p-5 ref-card space-y-1">
      <div class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Cobrado / Pagado</div>
      <div class="text-xl font-extrabold font-mono text-zinc-900 dark:text-white">$770,300.00</div>
      <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
        <span>69.1% de efectividad</span>
      </div>
    </div>

    <div class="p-5 ref-card space-y-1">
      <div class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Saldo por Cobrar</div>
      <div class="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400">$344,590.50</div>
      <div class="text-[11px] text-zinc-400">
        4 facturas con balance
      </div>
    </div>
  `;
}

function renderBarChart(isShimmer: boolean): string {
  return `
    <div class="h-48 flex flex-col justify-between relative">
      <!-- Grid Lines Background -->
      <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
        <div class="sk-grid-line"></div>
        <div class="sk-grid-line"></div>
        <div class="sk-grid-line"></div>
        <div class="sk-grid-line"></div>
      </div>

      <!-- Bars Container -->
      <div class="relative z-10 h-36 flex items-end justify-between gap-2 px-2 pt-2">
        ${MONTHLY_DATA.map((item, idx) => {
          if (isShimmer) {
            return `
              <div class="flex-1 flex flex-col items-center justify-end h-full">
                <div class="sk-chart-bar" style="height: ${item.heightPct}%;"></div>
              </div>
            `;
          }
          return `
            <div class="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer">
              <div class="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300 shadow-sm" style="height: ${item.heightPct}%;"></div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- X Axis Labels -->
      <div class="relative z-10 flex items-center justify-between px-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
        ${MONTHLY_DATA.map(item => `
          <div class="flex-1 text-center">${item.month}</div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAreaChart(isShimmer: boolean): string {
  if (isShimmer) {
    return `
      <div class="h-48 flex flex-col justify-between relative">
        <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div class="sk-grid-line"></div>
          <div class="sk-grid-line"></div>
          <div class="sk-grid-line"></div>
        </div>

        <div class="relative z-10 h-36 flex items-center justify-center">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
            <path d="M0,90 Q50,30 100,70 T200,40 T300,20" class="flickerless-chart-curve" />
            <path d="M0,90 Q50,30 100,70 T200,40 T300,20 L300,120 L0,120 Z" fill="url(#shimmer-area-grad)" opacity="0.3" />
            <defs>
              <linearGradient id="shimmer-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--skeleton-base)" stop-opacity="0.8" />
                <stop offset="100%" stop-color="var(--skeleton-base)" stop-opacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="flex items-center justify-between px-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
          <span>Semana 1</span>
          <span>Semana 2</span>
          <span>Semana 3</span>
          <span>Semana 4</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="h-48 flex flex-col justify-between relative">
      <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
        <div class="sk-grid-line"></div>
        <div class="sk-grid-line"></div>
        <div class="sk-grid-line"></div>
      </div>

      <div class="relative z-10 h-36 flex items-center justify-center">
        <svg class="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
          <path d="M0,90 Q50,30 100,70 T200,40 T300,20 L300,120 L0,120 Z" fill="url(#real-area-grad)" />
          <path d="M0,90 Q50,30 100,70 T200,40 T300,20" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="300" cy="20" r="4" fill="#10b981" class="animate-ping" opacity="0.75" />
          <circle cx="300" cy="20" r="4" fill="#10b981" />
          <defs>
            <linearGradient id="real-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="flex items-center justify-between px-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
        <span>Semana 1</span>
        <span>Semana 2</span>
        <span>Semana 3</span>
        <span>Semana 4</span>
      </div>
    </div>
  `;
}

function renderShimmerTable(): string {
  return `
    <table class="w-full text-left text-xs border-collapse">
      <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60">
        ${SKELETON_ROWS.map(row => `
          <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
            <td class="py-3.5 px-4 w-12 text-center">
              <div class="w-4 h-4 mx-auto rounded border border-zinc-300 dark:border-zinc-700 bg-transparent"></div>
            </td>
            <td class="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              ${row.code}
            </td>
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-3">
                <div class="sk-avatar"></div>
                <div class="space-y-1">
                  <div class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">${row.clientTitle}</div>
                  <div class="text-[11px] text-zinc-400 dark:text-zinc-500">${row.clientSub}</div>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-4 font-mono font-semibold text-zinc-700 dark:text-zinc-300">
              ${row.ncf}
            </td>
            <td class="py-3.5 px-4 font-mono text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              ${row.date}
            </td>
            <td class="py-3.5 px-4 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              ${row.total}
            </td>
            <td class="py-3.5 px-4 text-right font-mono text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              ${row.balance}
            </td>
            <td class="py-3.5 px-4 text-center">
              <div class="sk-badge mx-auto"></div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderLoadedTable(invoices: Invoice[]): string {
  if (invoices.length === 0) {
    return `
      <div class="py-16 text-center text-zinc-500 space-y-2">
        <div class="text-2xl">🔍</div>
        <p class="font-medium text-xs">No se encontraron facturas con los filtros seleccionados.</p>
      </div>
    `;
  }

  return `
    <table class="w-full text-left text-xs border-collapse">
      <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60">
        ${invoices.map(inv => `
          <tr class="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">
            <td class="py-3.5 px-4 w-12 text-center">
              <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 accent-blue-600 cursor-pointer">
            </td>
            <td class="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              ${inv.number}
            </td>
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm">
                  ${inv.client.charAt(0)}
                </div>
                <div>
                  <div class="font-semibold text-zinc-900 dark:text-zinc-100">${inv.client}</div>
                  <div class="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">RNC: ${inv.clientRnc}</div>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-4 font-mono font-semibold text-zinc-800 dark:text-zinc-200">
              <span class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px]">
                ${inv.ncf}
              </span>
            </td>
            <td class="py-3.5 px-4 font-mono text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
              ${inv.dueDate}
            </td>
            <td class="py-3.5 px-4 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              ${formatCurrency(inv.total)}
            </td>
            <td class="py-3.5 px-4 text-right font-mono whitespace-nowrap ${inv.balance > 0 ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-zinc-400 dark:text-zinc-500'}">
              ${inv.balance > 0 ? formatCurrency(inv.balance) : 'Pagado'}
            </td>
            <td class="py-3.5 px-4 text-center whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeClass(inv.status)}">
                ${inv.status}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function getStatusBadgeClass(status: Invoice['status']): string {
  switch (status) {
    case 'Emitida':
      return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    case 'Borrador':
      return 'bg-zinc-100 dark:bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20';
    case 'Rechazada DGII':
      return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
    case 'Anulada':
      return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
  }
}

function attachEventListeners() {
  document.getElementById('btn-state-shimmer')?.addEventListener('click', () => {
    viewState = 'shimmer';
    render();
  });

  document.getElementById('btn-state-loaded')?.addEventListener('click', () => {
    viewState = 'loaded';
    render();
  });

  document.getElementById('tab-section-dashboard')?.addEventListener('click', () => {
    activeSection = 'dashboard';
    render();
  });

  document.getElementById('tab-section-table')?.addEventListener('click', () => {
    activeSection = 'table';
    render();
  });

  document.getElementById('btn-simulate-fetch')?.addEventListener('click', () => {
    triggerSimulatedFetch();
  });

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
  });

  // Speed controls
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const spd = parseFloat((e.currentTarget as HTMLElement).getAttribute('data-speed') || '2.0');
      setShimmerSpeed(spd);
    });
  });

  // Color controls
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const col = (e.currentTarget as HTMLElement).getAttribute('data-color') || '#3b82f6';
      setBarColor(col);
    });
  });

  // Search input
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    searchKeyword = (e.target as HTMLInputElement).value;
    if (viewState === 'loaded') {
      render();
    }
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentTab = (e.currentTarget as HTMLElement).getAttribute('data-tab') || 'Todas';
      render();
    });
  });
}

// Initial render
render();
