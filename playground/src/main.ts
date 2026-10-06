import { MOCK_INVOICES, Invoice } from './mockData';

// Modes & State
type ComparisonMode = 'flickerless' | 'skeleton';
type ViewState = 'cold_skeleton' | 'warm_refetch' | 'loaded';
type ActiveSection = 'dashboard' | 'table';

let comparisonMode: ComparisonMode = 'flickerless';
let viewState: ViewState = 'loaded';
let activeSection: ActiveSection = 'dashboard';
let currentTab: string = 'Todas';
let searchKeyword: string = '';
let isDarkTheme: boolean = false;
let shimmerSpeed: number = 2.0; // seconds
let activeBarColor: string = '#10b981'; // emerald
let simulatedLatency: number = 400; // ms
let isFetching: boolean = false;
let savingRowId: string | null = null;

// Telemetry / Counters
let skeletonFlickerCount: number = 0;
let flickerlessFlickerCount: number = 0;

const app = document.getElementById('app')!;

const SKELETON_ROWS = [
  { id: '1', code: 'FAC-2026-001', clientTitle: 'Claro Dominicana', clientSub: 'Telecomunicaciones B2B', ncf: 'B0100004921', date: '29 nov', total: '$14,600.00', balance: '$0.00' },
  { id: '2', code: 'FAC-2026-002', clientTitle: 'Banco BHD León', clientSub: 'Finanzas & Seguros', ncf: 'B0100004922', date: '28 jun', total: '$48,200.00', balance: '$12,500.00' },
  { id: '3', code: 'FAC-2026-003', clientTitle: 'Grupo Ramos', clientSub: 'Retail & Supermercados', ncf: 'B0100004923', date: '20 mar', total: '$21,450.00', balance: '$0.00' },
  { id: '4', code: 'FAC-2026-004', clientTitle: 'Cervecería Nacional', clientSub: 'Manufactura & Bebidas', ncf: 'B0100004924', date: '28 mar', total: '$92,300.00', balance: '$34,000.00' },
  { id: '5', code: 'FAC-2026-005', clientTitle: 'Aerodom Siglo XXI', clientSub: 'Logística Aeroportuaria', ncf: 'B0100004925', date: '03 nov', total: '$31,800.00', balance: '$0.00' },
  { id: '6', code: 'FAC-2026-006', clientTitle: 'Punta Cana Resort', clientSub: 'Turismo & Hospitalidad', ncf: 'B0100004926', date: '15 dic', total: '$65,000.00', balance: '$18,200.00' },
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

function triggerSimulatedFetch(type: 'cold' | 'warm' = 'warm') {
  if (isFetching) return;
  isFetching = true;

  if (type === 'cold') {
    viewState = 'cold_skeleton';
    if (comparisonMode === 'skeleton') {
      skeletonFlickerCount += 1;
    }
  } else {
    // Warm refetch (e.g. search, pagination, tabs)
    if (comparisonMode === 'skeleton') {
      viewState = 'cold_skeleton'; // El skeleton clásico destruye los datos y parpadea
      skeletonFlickerCount += 1;
    } else {
      viewState = 'warm_refetch'; // Flickerless mantiene los datos al 50% con micro-barra
    }
  }

  render();

  setTimeout(() => {
    isFetching = false;
    viewState = 'loaded';
    render();
  }, simulatedLatency);
}

function simulateSaveRow(id: string) {
  if (savingRowId) return;
  savingRowId = id;
  render();

  setTimeout(() => {
    savingRowId = null;
    render();
  }, 1200);
}

function render() {
  const isColdSkeleton = viewState === 'cold_skeleton';
  const isWarmRefetch = viewState === 'warm_refetch';
  const isFlickerlessMode = comparisonMode === 'flickerless';

  app.innerHTML = `
    <!-- Ambient Backdrop -->
    <div class="ambient-glow"></div>
    <div class="ambient-grid"></div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      
      <!-- Top Bar: Branding & Live Controls -->
      <header class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ⚡ Flickerless v0.2.0
            </span>
            <span class="text-xs font-mono text-zinc-500">Suite de Carga Calmada sin CLS</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Laboratorio Interactivo de Carga</span>
          </h1>
          <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Compara en tiempo real la experiencia entre un <strong>Skeleton Tradicional</strong> (parpadeante y destructivo) y <strong>Flickerless</strong> (estable y calmado).
          </p>
        </div>

        <!-- Mode Switcher -->
        <div class="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <!-- Toggle Mode -->
          <div class="flex items-center p-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-800 text-xs font-semibold">
            <button id="btn-mode-flickerless" class="px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${isFlickerlessMode ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}">
              <span>⚡ Flickerless Calm</span>
            </button>
            <button id="btn-mode-skeleton" class="px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${!isFlickerlessMode ? 'bg-zinc-800 text-amber-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}">
              <span>💀 Skeleton Clásico</span>
            </button>
          </div>

          <!-- Theme Toggle -->
          <button id="btn-theme-toggle" title="Cambiar tema claro / oscuro" class="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition cursor-pointer shadow-sm">
            ${isDarkTheme ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <!-- 📊 Telemetry Comparative HUD (Dashboard de Métricas en Vivo) -->
      <section class="mb-6 p-4 rounded-2xl ${isFlickerlessMode ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-amber-950/20 border-amber-500/30'} border transition-colors duration-300">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl ${isFlickerlessMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'} flex items-center justify-center text-lg font-bold">
              ${isFlickerlessMode ? '⚡' : '⚠️'}
            </div>
            <div>
              <div class="text-xs font-bold ${isFlickerlessMode ? 'text-emerald-400' : 'text-amber-400'} uppercase tracking-wider">
                Modo Actual: ${isFlickerlessMode ? 'Flickerless Surface (Carga Inteligente)' : 'Skeleton Tradicional (Maqueta Destructiva)'}
              </div>
              <div class="text-xs text-zinc-400">
                ${isFlickerlessMode ? 'Mantiene los datos previos al 50% con micro-barra de 2px. Cero parpadeo.' : 'Destruye el DOM en cada interacción, mostrando rectángulos grises.'}
              </div>
            </div>
          </div>

          <!-- Telemetry Counters -->
          <div class="flex items-center gap-6 font-mono text-xs">
            <div class="text-right">
              <div class="text-[10px] uppercase text-zinc-500 font-sans">Parpadeos Sufridos</div>
              <div class="text-base font-extrabold ${isFlickerlessMode ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}">
                ${isFlickerlessMode ? '0 flickers' : `${skeletonFlickerCount} flickers`}
              </div>
            </div>
            <div class="text-right">
              <div class="text-[10px] uppercase text-zinc-500 font-sans">Layout Shift (CLS)</div>
              <div class="text-base font-extrabold ${isFlickerlessMode ? 'text-emerald-400' : 'text-amber-400'}">
                ${isFlickerlessMode ? '0.000 (Perfecto)' : '0.380 (Deficiente)'}
              </div>
            </div>
            <div class="text-right">
              <div class="text-[10px] uppercase text-zinc-500 font-sans">Nodos DOM Extra</div>
              <div class="text-base font-extrabold text-zinc-300">
                ${isFlickerlessMode ? '0 divs' : '54 divs'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Controls Toolbar -->
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm text-xs">
        <!-- Action Buttons to Trigger Fetches -->
        <div class="flex flex-wrap items-center gap-2">
          <button id="btn-warm-fetch" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${isFetching ? 'opacity-70 cursor-wait' : ''}">
            <svg class="w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            <span>Filtrar / Paginar (${simulatedLatency}ms)</span>
          </button>

          <button id="btn-cold-fetch" class="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium transition cursor-pointer flex items-center gap-1.5">
            <span>❄️ Carga en Frío (1ª vez)</span>
          </button>
        </div>

        <!-- Latency Slider -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5 font-mono">
            <span class="text-zinc-500">Latencia API:</span>
            ${[
              { ms: 150, label: '150ms' },
              { ms: 400, label: '400ms' },
              { ms: 900, label: '900ms' },
              { ms: 1800, label: '1.8s' }
            ].map(l => `
              <button data-latency="${l.ms}" class="latency-btn px-2 py-0.5 rounded text-[11px] transition cursor-pointer ${simulatedLatency === l.ms ? 'bg-emerald-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}">
                ${l.label}
              </button>
            `).join('')}
          </div>

          <!-- Section Switcher -->
          <div class="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-semibold">
            <button id="tab-section-dashboard" class="px-2.5 py-1 rounded text-[11px] transition cursor-pointer ${activeSection === 'dashboard' ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-zinc-500'}">
              Dashboard
            </button>
            <button id="tab-section-table" class="px-2.5 py-1 rounded text-[11px] transition cursor-pointer ${activeSection === 'table' ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-zinc-500'}">
              Tabla
            </button>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT AREA -->
      <main class="space-y-6">
        
        <!-- DASHBOARD SECTION (KPIS + CHARTS) -->
        ${activeSection === 'dashboard' ? `
          <!-- KPI Summary Metrics (FlickerlessSurface Wrapper) -->
          <div class="flickerless-surface ${isWarmRefetch ? 'flickerless-loading' : ''}">
            <div class="flickerless-stream" style="${isWarmRefetch ? '' : 'display:none;'}"></div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 ${isWarmRefetch ? 'flickerless-body' : ''}">
              ${isColdSkeleton ? renderKPICards(true) : renderKPICards(false)}
            </div>
          </div>

          <!-- Charts Grid: Bar Chart + Area Sparkline -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left: Bar Chart -->
            <div class="lg:col-span-7 ref-card overflow-hidden flickerless-surface ${isWarmRefetch ? 'flickerless-loading' : ''}">
              <div class="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Facturación Mensual B2B</h3>
                  <p class="text-[11px] text-zinc-500">Preserva exactamente 220px de altura (0.00 CLS)</p>
                </div>
                <span class="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">2026</span>
              </div>
              
              <!-- 2px Linear Stream Bar -->
              <div class="linear-stream-track" style="${isWarmRefetch ? '' : 'display:none;'}">
                <div class="linear-stream-bar"></div>
              </div>

              <!-- Bar Chart Surface -->
              <div class="p-6 ${isColdSkeleton ? 'shimmer-sweep-surface' : ''} ${isWarmRefetch ? 'flickerless-body' : ''}">
                ${renderBarChart(isColdSkeleton)}
              </div>
            </div>

            <!-- Right: Area Trend Chart -->
            <div class="lg:col-span-5 ref-card overflow-hidden flickerless-surface ${isWarmRefetch ? 'flickerless-loading' : ''}">
              <div class="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Tendencia de Cobros</h3>
                  <p class="text-[11px] text-zinc-500">Recuperación de cartera</p>
                </div>
                <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">+14.2%</span>
              </div>

              <!-- 2px Linear Stream Bar -->
              <div class="linear-stream-track" style="${isWarmRefetch ? '' : 'display:none;'}">
                <div class="linear-stream-bar"></div>
              </div>

              <!-- Area Curve Surface -->
              <div class="p-6 ${isColdSkeleton ? 'shimmer-sweep-surface' : ''} ${isWarmRefetch ? 'flickerless-body' : ''}">
                ${renderAreaChart(isColdSkeleton)}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- TABLE CONTAINER -->
        <div class="ref-card overflow-hidden flickerless-surface ${isWarmRefetch ? 'flickerless-loading' : ''} flickerless-preserve-height">
          
          <!-- Navigation Tabs Bar -->
          <div class="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              ${[
                { name: 'Todas', count: 6 },
                { name: 'Emitidas', count: 3 },
                { name: 'Borradores', count: 2 },
                { name: 'Anuladas', count: 1 },
              ].map(tab => {
                const isActive = currentTab === tab.name;
                return `
                  <button data-tab="${tab.name}" class="tab-btn px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-2 ${isActive ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}">
                    <span>${tab.name}</span>
                    <span class="px-1.5 py-0.2 text-[10px] font-mono rounded-full ${isActive ? 'bg-emerald-200/70 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}">
                      ${tab.count}
                    </span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Hint: Inline Saving Demonstration -->
            <div class="text-[11px] text-zinc-400 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Haz clic en <strong>"Guardar"</strong> en cualquier fila para probar mutaciones en línea</span>
            </div>
          </div>

          <!-- Search Bar & Filters -->
          <div class="p-4 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-2 sm:gap-3 bg-zinc-50/50 dark:bg-zinc-950/30">
            <div class="relative flex-1 min-w-[240px]">
              <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input id="search-input" type="text" placeholder="Buscar por cliente, NCF o código..." value="${searchKeyword}" class="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500 transition shadow-sm">
            </div>
          </div>

          <!-- Table Header -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="text-zinc-600 dark:text-zinc-400 font-bold text-[12px] bg-zinc-50/70 dark:bg-zinc-950/50">
                  <th class="py-3.5 px-4 w-12 text-center">#</th>
                  <th class="py-3.5 px-4 font-semibold">Código</th>
                  <th class="py-3.5 px-4 font-semibold">Cliente B2B</th>
                  <th class="py-3.5 px-4 font-semibold">Comprobante DGII</th>
                  <th class="py-3.5 px-4 font-semibold">Vencimiento</th>
                  <th class="py-3.5 px-4 text-right font-semibold">Total</th>
                  <th class="py-3.5 px-4 text-right font-semibold">Saldo</th>
                  <th class="py-3.5 px-4 text-center font-semibold">Estado</th>
                  <th class="py-3.5 px-4 text-center font-semibold w-24">Mutación</th>
                </tr>
              </thead>
            </table>
          </div>

          <!-- 2px Linear Progress Bar under the header -->
          <div class="linear-stream-track" style="${isWarmRefetch ? '' : 'display:none;'}">
            <div class="linear-stream-bar"></div>
          </div>

          <!-- Table Body Surface -->
          <div class="overflow-x-auto ${isColdSkeleton ? 'shimmer-sweep-surface' : ''} ${isWarmRefetch ? 'flickerless-body' : ''}">
            ${isColdSkeleton ? renderShimmerTable() : renderLoadedTable(getFilteredInvoices())}
          </div>

        </div>

      </main>

      <!-- Architecture Guide Cards -->
      <section class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div class="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div class="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <span class="text-emerald-500 text-sm">✓</span>
            <span>1. Cero Mantenimiento</span>
          </div>
          <p class="text-zinc-500 leading-relaxed text-[11px]">
            No tienes que programar 40 líneas de celdas falsas. En recargas, el propio contenido real actúa como su layout con atenuación al 50%.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div class="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <span class="text-emerald-500 text-sm">✓</span>
            <span>2. Zero CLS Lock</span>
          </div>
          <p class="text-zinc-500 leading-relaxed text-[11px]">
            La directiva y clase <code>flickerless-preserve-height</code> retiene la altura previa durante el intercambio de datos, eliminando saltos.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div class="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <span class="text-emerald-500 text-sm">✓</span>
            <span>3. Mutaciones en Línea</span>
          </div>
          <p class="text-zinc-500 leading-relaxed text-[11px]">
            La clase <code>flickerless-saving</code> aplica el haz de luz directamente sobre la fila o botón individual mientras guarda en BD.
          </p>
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
      <div class="text-[11px] text-zinc-400">4 facturas con balance</div>
    </div>
  `;
}

function renderBarChart(isShimmer: boolean): string {
  return `
    <div class="h-48 flex flex-col justify-between relative">
      <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
        <div class="sk-grid-line"></div>
        <div class="sk-grid-line"></div>
        <div class="sk-grid-line"></div>
        <div class="sk-grid-line"></div>
      </div>

      <div class="relative z-10 h-36 flex items-end justify-between gap-2 px-2 pt-2">
        ${MONTHLY_DATA.map((item) => {
          if (isShimmer) {
            return `
              <div class="flex-1 flex flex-col items-center justify-end h-full">
                <div class="sk-chart-bar" style="height: ${item.heightPct}%;"></div>
              </div>
            `;
          }
          return `
            <div class="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer">
              <div class="w-full bg-emerald-500/80 hover:bg-emerald-400 rounded-t-md transition-all duration-300 relative" style="height: ${item.heightPct}%;"></div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="flex items-center justify-between px-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
        ${MONTHLY_DATA.map(m => `<span>${m.month}</span>`).join('')}
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
            <path class="flickerless-chart-curve" d="M0,90 Q50,30 100,70 T200,40 T300,20" />
            <path d="M0,90 Q50,30 100,70 T200,40 T300,20 L300,120 L0,120 Z" fill="rgba(161, 161, 170, 0.08)" />
          </svg>
        </div>

        <div class="flex items-center justify-between px-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
          <span>Sem 1</span>
          <span>Sem 2</span>
          <span>Sem 3</span>
          <span>Sem 4</span>
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
        <span>Sem 1</span>
        <span>Sem 2</span>
        <span>Sem 3</span>
        <span>Sem 4</span>
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
            <td class="py-3.5 px-4 text-center">
              <div class="h-6 w-14 rounded-md bg-zinc-200 dark:bg-zinc-800 mx-auto"></div>
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
        <p class="font-medium text-xs">No se encontraron comprobantes fiscales coincidentes.</p>
      </div>
    `;
  }

  return `
    <table class="w-full text-left text-xs border-collapse">
      <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60">
        ${invoices.map((inv, idx) => {
          const isSaving = savingRowId === inv.id;
          return `
            <tr class="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors ${isSaving ? 'flickerless-saving' : ''}">
              <td class="py-3.5 px-4 w-12 text-center text-zinc-400 font-mono">
                ${idx + 1}
              </td>
              <td class="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                ${inv.number}
              </td>
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm">
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
                ${inv.balance > 0 ? formatCurrency(inv.balance) : 'Saldado'}
              </td>
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeClass(inv.status)}">
                  ${inv.status}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <button data-save-id="${inv.id}" class="save-row-btn px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${isSaving ? 'bg-emerald-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'}">
                  ${isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </td>
            </tr>
          `;
        }).join('')}
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
  document.getElementById('btn-mode-flickerless')?.addEventListener('click', () => {
    comparisonMode = 'flickerless';
    render();
  });

  document.getElementById('btn-mode-skeleton')?.addEventListener('click', () => {
    comparisonMode = 'skeleton';
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

  document.getElementById('btn-warm-fetch')?.addEventListener('click', () => {
    triggerSimulatedFetch('warm');
  });

  document.getElementById('btn-cold-fetch')?.addEventListener('click', () => {
    triggerSimulatedFetch('cold');
  });

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
  });

  // Latency controls
  document.querySelectorAll('.latency-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lat = parseInt((e.currentTarget as HTMLElement).getAttribute('data-latency') || '400', 10);
      simulatedLatency = lat;
      render();
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
      triggerSimulatedFetch('warm');
    });
  });

  // Save row inline mutation buttons
  document.querySelectorAll('.save-row-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-save-id') || '';
      simulateSaveRow(id);
    });
  });
}

// Initial render
render();
