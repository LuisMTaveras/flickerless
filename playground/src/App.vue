<script setup lang="ts">
import { ref } from 'vue';
import IndicadoresClaveView from './views/IndicadoresClaveView.vue';
import CohortesView from './views/CohortesView.vue';
import FacturacionView from './views/FacturacionView.vue';

// Estado global de la simulación
const comparisonMode = ref<'flickerless' | 'skeleton'>('flickerless');
const activeScreen = ref<'indicadores' | 'cohortes' | 'facturacion'>('indicadores');
const isLoading = ref(false);
const isColdStart = ref(false);
const simulatedLatency = ref(400);
const isDark = ref(true);
const periodo = ref('Este año');

// Telemetría
const flickerCount = ref(0);

function toggleTheme() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function triggerFetch(cold = false) {
  if (isLoading.value) return;
  isLoading.value = true;
  isColdStart.value = cold;

  if (comparisonMode.value === 'skeleton') {
    flickerCount.value += 1;
  }

  // Alternar período para simular cambio de datos reales
  if (!cold) {
    periodo.value = periodo.value === 'Este año' ? 'Último Trimestre' : 'Este año';
  }

  setTimeout(() => {
    isLoading.value = false;
    isColdStart.value = false;
  }, simulatedLatency.value);
}
</script>

<template>
  <div class="min-h-screen">
    <!-- AMBIENT EFFECTS -->
    <div class="ambient-glow"></div>
    <div class="ambient-grid"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 md:py-8 space-y-6">
      
      <!-- 1. TOP GLOBAL APPLICATION HEADER -->
      <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ⚡ Flickerless Vue 3 Showcase
            </span>
            <span class="text-xs font-mono text-zinc-500">Demostrador de Alto Rendimiento</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Suite Analítica B2B & Datagrids</span>
          </h1>
          <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-3xl">
            Prueba cómo interactúa la suite analítica real de <strong>Snowir Corp</strong> frente a la fatiga visual de los skeletons.
          </p>
        </div>

        <!-- Global Mode Switcher & Dark Mode -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Switcher -->
          <div class="flex items-center p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs font-bold">
            <button 
              @click="comparisonMode = 'flickerless'"
              class="px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              :class="comparisonMode === 'flickerless' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'"
            >
              <span>⚡ Modo Flickerless</span>
            </button>
            <button 
              @click="comparisonMode = 'skeleton'"
              class="px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              :class="comparisonMode === 'skeleton' ? 'bg-zinc-800 text-amber-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'"
            >
              <span>💀 Skeleton Tradicional</span>
            </button>
          </div>

          <button 
            @click="toggleTheme"
            title="Cambiar tema claro / oscuro"
            class="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition cursor-pointer shadow-sm"
          >
            {{ isDark ? '☀️' : '🌙' }}
          </button>
        </div>
      </header>

      <!-- 2. HUD DE TELEMETRÍA EN VIVO -->
      <section 
        class="p-4 rounded-2xl border transition-all duration-300"
        :class="comparisonMode === 'flickerless' ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-amber-950/20 border-amber-500/30'"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
              :class="comparisonMode === 'flickerless' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'"
            >
              {{ comparisonMode === 'flickerless' ? '⚡' : '💀' }}
            </div>
            <div>
              <div 
                class="text-xs font-bold uppercase tracking-wider"
                :class="comparisonMode === 'flickerless' ? 'text-emerald-400' : 'text-amber-400'"
              >
                {{ comparisonMode === 'flickerless' ? 'Flickerless Calm Architecture' : 'Skeleton Tradicional (Pulse destructivo)' }}
              </div>
              <div class="text-xs text-zinc-400">
                {{ comparisonMode === 'flickerless' ? 'Preserva el foco del usuario manteniendo los datos previos al 50% con micro-barra de 2px.' : 'Destruye los datos en cada consulta, parpadeando con rectángulos grises y saltos de layout.' }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-6 font-mono text-xs">
            <div class="text-right">
              <div class="text-[10px] uppercase text-zinc-500 font-sans">Parpadeos Sufridos</div>
              <div 
                class="text-base font-extrabold"
                :class="comparisonMode === 'flickerless' ? 'text-emerald-400' : 'text-rose-400 animate-pulse'"
              >
                {{ comparisonMode === 'flickerless' ? '0 flickers' : `${flickerCount} flickers` }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-[10px] uppercase text-zinc-500 font-sans">Layout Shift (CLS)</div>
              <div 
                class="text-base font-extrabold"
                :class="comparisonMode === 'flickerless' ? 'text-emerald-400' : 'text-amber-400'"
              >
                {{ comparisonMode === 'flickerless' ? '0.000 (Perfecto)' : '0.380 (Deficiente)' }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-[10px] uppercase text-zinc-500 font-sans">Divs Creados</div>
              <div class="text-base font-extrabold text-zinc-300">
                {{ comparisonMode === 'flickerless' ? '0 divs' : '54 divs' }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. MAIN NAVIGATION TABS (Pantallas de la Aplicación del Usuario) -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 ref-card text-xs">
        
        <!-- Screen Switcher Tabs -->
        <div class="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-semibold">
          <button 
            @click="activeScreen = 'indicadores'"
            class="px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            :class="activeScreen === 'indicadores' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'"
          >
            <span>📊 1. Indicadores Clave</span>
          </button>

          <button 
            @click="activeScreen = 'cohortes'"
            class="px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            :class="activeScreen === 'cohortes' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'"
          >
            <span>📈 2. Cohortes & Retención</span>
          </button>

          <button 
            @click="activeScreen = 'facturacion'"
            class="px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            :class="activeScreen === 'facturacion' ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'"
          >
            <span>🧾 3. Facturación (DGII)</span>
          </button>
        </div>

        <!-- Simulation Triggers -->
        <div class="flex items-center gap-2">
          <button 
            @click="triggerFetch(false)"
            :disabled="isLoading"
            class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-60"
          >
            <svg class="w-3.5 h-3.5" :class="isLoading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            <span>Simular Recarga ({{ simulatedLatency }}ms)</span>
          </button>

          <button 
            @click="triggerFetch(true)"
            :disabled="isLoading"
            class="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
          >
            <span>❄️ Carga en Frío (1ª vez)</span>
          </button>

          <!-- Latency selector -->
          <div class="flex items-center gap-1 font-mono ml-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
            <span class="text-zinc-400 text-[11px]">Red:</span>
            <button 
              v-for="lat in [150, 400, 800, 1500]"
              :key="lat"
              @click="simulatedLatency = lat"
              class="px-2 py-0.5 rounded text-[11px] transition cursor-pointer"
              :class="simulatedLatency === lat ? 'bg-emerald-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white'"
            >
              {{ lat }}ms
            </button>
          </div>
        </div>

      </div>

      <!-- 4. ACTIVE SCREEN VIEW -->
      <main>
        <IndicadoresClaveView 
          v-if="activeScreen === 'indicadores'"
          :mode="comparisonMode"
          :loading="isLoading"
          :is-cold-start="isColdStart"
          :periodo="periodo"
          @refetch="triggerFetch(false)"
        />

        <CohortesView 
          v-else-if="activeScreen === 'cohortes'"
          :mode="comparisonMode"
          :loading="isLoading"
          :is-cold-start="isColdStart"
          :periodo="periodo"
          @refetch="triggerFetch(false)"
        />

        <FacturacionView 
          v-else-if="activeScreen === 'facturacion'"
          :mode="comparisonMode"
          :loading="isLoading"
          :is-cold-start="isColdStart"
          @refetch="triggerFetch(false)"
        />
      </main>

    </div>
  </div>
</template>
