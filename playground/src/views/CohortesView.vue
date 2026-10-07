<script setup lang="ts">
import { FlickerlessSurface, FlickerlessValue } from '@flickerless/vue';

defineProps<{
  mode: 'flickerless' | 'skeleton';
  loading: boolean;
  isColdStart: boolean;
  periodo: string;
}>();

const emit = defineEmits<{
  (e: 'refetch'): void;
}>();
</script>

<template>
  <div class="space-y-5">
    
    <!-- SUBHEADER BAR -->
    <div class="p-3.5 ref-card flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
          📈
        </div>
        <div>
          <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Cohortes</h2>
          <p class="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">INTELIGENCIA DE NEGOCIO › CLIENTES Y DEMANDA</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div class="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
          🏢 Sucursal: <strong class="text-zinc-900 dark:text-zinc-200 font-sans">Snowir Corp Suc Moca</strong>
        </div>

        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-semibold text-[11px]">
          <span class="px-2 text-zinc-500">Periodo:</span>
          <span class="px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm">{{ periodo }}</span>
          <span class="px-2 py-0.5 text-zinc-400">HOY</span>
          <span class="px-2 py-0.5 text-zinc-400 font-mono">DOP</span>
        </div>

        <button 
          @click="emit('refetch')"
          class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          <span>Actualizar</span>
        </button>
      </div>
    </div>

    <!-- 1. TOP 4 COHORT METRICS -->
    <div>
      <template v-if="mode === 'flickerless'">
        <FlickerlessSurface :loading="loading" :settled="!isColdStart" :preserve-height="true">

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 ref-card space-y-1">
              <div class="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">COHORTES ACTIVAS</div>
              <div class="text-2xl font-extrabold font-mono text-zinc-900 dark:text-white"><FlickerlessValue value="1" /></div>
            </div>

            <div class="p-4 ref-card space-y-1">
              <div class="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">BASE INICIAL</div>
              <div class="text-2xl font-extrabold font-mono text-zinc-900 dark:text-white"><FlickerlessValue :value="3">3 <span class="text-xs font-normal text-zinc-500">clientes</span></FlickerlessValue></div>
            </div>

            <div class="p-4 ref-card space-y-1">
              <div class="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">RETENCIÓN MES 1</div>
              <div class="text-2xl font-extrabold font-mono text-emerald-500"><FlickerlessValue value="67%" /></div>
            </div>

            <div class="p-4 ref-card space-y-1">
              <div class="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">HEALTH SCORE</div>
              <div class="text-2xl font-extrabold font-mono text-rose-500"><FlickerlessValue value="27" /></div>
            </div>
          </div>
        </FlickerlessSurface>
      </template>

      <template v-else>
        <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="p-4 ref-card space-y-2">
            <div class="classic-skeleton-box h-3 w-28"></div>
            <div class="classic-skeleton-box h-8 w-16"></div>
          </div>
        </div>
        <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 ref-card space-y-1">
            <div class="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">COHORTES ACTIVAS</div>
            <div class="text-2xl font-extrabold font-mono text-zinc-900 dark:text-white">1</div>
          </div>
          <div class="p-4 ref-card space-y-1">
            <div class="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">BASE INICIAL</div>
            <div class="text-2xl font-extrabold font-mono text-zinc-900 dark:text-white">3 clientes</div>
          </div>
          <div class="p-4 ref-card space-y-1">
            <div class="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">RETENCIÓN MES 1</div>
            <div class="text-2xl font-extrabold font-mono text-emerald-500">67%</div>
          </div>
          <div class="p-4 ref-card space-y-1">
            <div class="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">HEALTH SCORE</div>
            <div class="text-2xl font-extrabold font-mono text-rose-500">27</div>
          </div>
        </div>
      </template>
    </div>

    <!-- 2. CURVA DE SUPERVIVENCIA & HITOS DE RETENCIÓN -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      <!-- Left: Curva de supervivencia -->
      <div class="lg:col-span-8 ref-card overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Curva de supervivencia</h3>
            <p class="text-[11px] text-zinc-500">Análisis de decaimiento de clientes por mes</p>
          </div>
        </div>

        <div class="p-5">
          <template v-if="mode === 'flickerless'">
            <FlickerlessSurface :loading="loading" :settled="!isColdStart" :preserve-height="true">

              <div class="h-56 flex flex-col justify-between relative">
                <template v-if="!isColdStart">
                <!-- Grid Lines -->
                <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div class="sk-grid-line"></div>
                  <div class="sk-grid-line"></div>
                  <div class="sk-grid-line"></div>
                  <div class="sk-grid-line"></div>
                </div>

                <div class="relative z-10 h-44 flex items-center justify-center">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 400 130" preserveAspectRatio="none">
                    <!-- Curve from 100% (Mes 0) to 67% (Mes 1) to 0% (Mes 2) -->
                    <path d="M20,10 L70,55 L130,120 L380,120" fill="none" stroke="#52525b" stroke-width="2.5" stroke-linecap="round" />
                    <!-- Points -->
                    <circle cx="20" cy="10" r="5" fill="#18181b" stroke="#71717a" stroke-width="2" />
                    <circle cx="70" cy="55" r="5" fill="#18181b" stroke="#71717a" stroke-width="2" />
                    <circle cx="130" cy="120" r="5" fill="#18181b" stroke="#71717a" stroke-width="2" />
                  </svg>
                </div>

                <!-- Labels -->
                <div class="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-2">
                  <span>Mes 0 (100%)</span>
                  <span>Mes 1 (67%)</span>
                  <span>Mes 2 (0%)</span>
                  <span>Mes 3</span>
                  <span>Mes 4</span>
                  <span>Mes 5</span>
                  <span>Mes 6</span>
                </div>
                </template>
              </div>
            </FlickerlessSurface>
          </template>

          <template v-else>
            <div v-if="loading" class="h-56 flex items-center justify-center">
              <div class="classic-skeleton-box w-full h-44 rounded-xl"></div>
            </div>
            <div v-else class="h-56 flex flex-col justify-between">
              <div class="h-44 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 400 130">
                  <path d="M20,10 L70,55 L130,120 L380,120" fill="none" stroke="#52525b" stroke-width="2.5" />
                  <circle cx="20" cy="10" r="5" fill="#10b981" />
                  <circle cx="70" cy="55" r="5" fill="#10b981" />
                  <circle cx="130" cy="120" r="5" fill="#10b981" />
                </svg>
              </div>
              <div class="flex justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t">
                <span>Mes 0 (100%)</span><span>Mes 1 (67%)</span><span>Mes 2 (0%)</span><span>Mes 3</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Right: Hitos de retención -->
      <div class="lg:col-span-4 ref-card p-5 space-y-4">
        <div class="border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Hitos de retención</h3>
          <p class="text-[11px] text-zinc-500">Retención acumulada (cohortes activas)</p>
        </div>

        <template v-if="mode === 'flickerless'">
          <FlickerlessSurface :loading="loading" :settled="!isColdStart">
            <div class="space-y-3">
              <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <div class="font-bold text-zinc-900 dark:text-zinc-100">Mes 1</div>
                  <div class="text-[10px] text-zinc-400">Retención acumulada</div>
                </div>
                <span class="text-base font-extrabold font-mono text-emerald-500"><FlickerlessValue value="67%" /></span>
              </div>

              <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <div class="font-bold text-zinc-900 dark:text-zinc-100">Mes 3</div>
                  <div class="text-[10px] text-zinc-400">Retención acumulada</div>
                </div>
                <span class="text-base font-extrabold font-mono text-zinc-400"><FlickerlessValue value="0%" /></span>
              </div>

              <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <div class="font-bold text-zinc-900 dark:text-zinc-100">Mes 6</div>
                  <div class="text-[10px] text-zinc-400">Retención acumulada</div>
                </div>
                <span class="text-xs font-bold font-mono text-zinc-500"><FlickerlessValue value="N/A" /></span>
              </div>
            </div>
          </FlickerlessSurface>
        </template>

        <template v-else>
          <div v-if="loading" class="space-y-3">
            <div class="classic-skeleton-box h-12 w-full rounded-xl"></div>
            <div class="classic-skeleton-box h-12 w-full rounded-xl"></div>
            <div class="classic-skeleton-box h-12 w-full rounded-xl"></div>
          </div>
          <div v-else class="space-y-3">
            <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex justify-between text-xs">
              <span>Mes 1</span><span class="font-bold text-emerald-500">67%</span>
            </div>
            <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex justify-between text-xs">
              <span>Mes 3</span><span class="font-bold">0%</span>
            </div>
            <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex justify-between text-xs">
              <span>Mes 6</span><span class="text-zinc-500 font-bold">N/A</span>
            </div>
          </div>
        </template>
      </div>

    </div>

    <!-- 3. DIAGNÓSTICO DE SALUD DE RED (BANNER DE RIESGO) -->
    <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div>
        <div class="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>🩺</span>
          <span>Diagnóstico de salud de red</span>
        </div>
        <p class="text-zinc-500 mt-1 text-[11px] leading-relaxed">
          Tu ecosistema de clientes presenta una estabilidad <strong>que requiere atención inmediata</strong>. La cohorte de <strong>2026-08</strong> es el referente con 22% de lealtad.
        </p>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap self-start sm:self-auto">
        ⚠️ RIESGO CRÍTICO · 27
      </span>
    </div>

    <!-- 4. MATRIZ DE RETENCIÓN ESTRUCTURAL -->
    <div class="ref-card p-5 space-y-4 overflow-x-auto">
      <div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Matriz de retención estructural</h3>
        <div class="flex items-center gap-3 text-[11px] font-medium">
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500"></span> Riesgo</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Vigilancia</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Salud</span>
        </div>
      </div>

      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="text-zinc-400 font-mono text-[11px] border-b border-zinc-100 dark:border-zinc-800">
            <th class="py-2.5 px-3">ADQUISICIÓN</th>
            <th class="py-2.5 px-3">BASE INICIAL</th>
            <th class="py-2.5 px-3">INICIAL</th>
            <th class="py-2.5 px-3">+1M</th>
            <th class="py-2.5 px-3">+2M</th>
            <th class="py-2.5 px-3">+3M</th>
            <th class="py-2.5 px-3">+4M</th>
            <th class="py-2.5 px-3">+5M</th>
          </tr>
        </thead>
        <tbody>
          <tr class="font-mono text-[11px] border-b border-zinc-100 dark:border-zinc-800/60">
            <td class="py-3 px-3 font-sans font-bold text-zinc-900 dark:text-zinc-100">Agosto 2026</td>
            <td class="py-3 px-3 text-zinc-400">3 clientes</td>
            <td class="py-3 px-3 font-bold text-emerald-500 bg-emerald-500/10 text-center rounded">100%</td>
            <td class="py-3 px-3 font-bold text-emerald-500 bg-emerald-500/10 text-center rounded">67%</td>
            <td class="py-3 px-3 font-bold text-rose-500 bg-rose-500/10 text-center rounded">0%</td>
            <td class="py-3 px-3 text-zinc-600 text-center">-</td>
            <td class="py-3 px-3 text-zinc-600 text-center">-</td>
            <td class="py-3 px-3 text-zinc-600 text-center">-</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
