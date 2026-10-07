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
    
    <!-- SUBHEADER BAR (Breadcrumbs & Period Filters) -->
    <div class="p-3.5 ref-card flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
          📊
        </div>
        <div>
          <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Indicadores Clave</h2>
          <p class="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">INTELIGENCIA DE NEGOCIO › PANORAMA</p>
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

    <!-- 1. TOP 6 KPI METRICS ROW -->
    <div>
      <!-- ⚡ FLICKERLESS MODE: Calm data surface -->
      <template v-if="mode === 'flickerless'">
        <FlickerlessSurface :loading="loading" :settled="!isColdStart" :preserve-height="true">

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div class="p-3.5 ref-card space-y-1">
              <div class="text-[10px] text-zinc-500 font-medium uppercase">Ingresos totales</div>
              <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white"><FlickerlessValue value="RD$ 297,033.42" /></div>
              <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"><FlickerlessValue value="↑ 100% vs mes ant." /></div>
            </div>

            <div class="p-3.5 ref-card space-y-1">
              <div class="text-[10px] text-zinc-500 font-medium uppercase">Pedidos</div>
              <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white"><FlickerlessValue value="23" /></div>
              <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"><FlickerlessValue value="↑ 100% vs mes ant." /></div>
            </div>

            <div class="p-3.5 ref-card space-y-1">
              <div class="text-[10px] text-zinc-500 font-medium uppercase">Ticket promedio</div>
              <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white"><FlickerlessValue value="RD$ 12,914.50" /></div>
              <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"><FlickerlessValue value="↑ 100% vs mes ant." /></div>
            </div>

            <div class="p-3.5 ref-card space-y-1">
              <div class="text-[10px] text-zinc-500 font-medium uppercase">Clientes activos</div>
              <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white"><FlickerlessValue value="3" /></div>
              <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"><FlickerlessValue value="↑ 100% vs mes ant." /></div>
            </div>

            <div class="p-3.5 ref-card space-y-1">
              <div class="text-[10px] text-zinc-500 font-medium uppercase">Clientes nuevos</div>
              <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white"><FlickerlessValue value="3" /></div>
              <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"><FlickerlessValue value="↑ 100% vs mes ant." /></div>
            </div>

            <div class="p-3.5 ref-card space-y-1">
              <div class="text-[10px] text-zinc-500 font-medium uppercase">Tasa de éxito</div>
              <div class="text-base font-extrabold font-mono text-emerald-500"><FlickerlessValue value="100%" /></div>
              <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"><FlickerlessValue value="↑ 100% vs mes ant." /></div>
            </div>
          </div>
        </FlickerlessSurface>
      </template>

      <!-- 💀 SKELETON MODE: Destructive blinking boxes -->
      <template v-else>
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div v-for="i in 6" :key="i" class="p-3.5 ref-card space-y-2">
            <div class="classic-skeleton-box h-3 w-20"></div>
            <div class="classic-skeleton-box h-6 w-28"></div>
            <div class="classic-skeleton-box h-2.5 w-16"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div class="p-3.5 ref-card space-y-1">
            <div class="text-[10px] text-zinc-500 font-medium uppercase">Ingresos totales</div>
            <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white">RD$ 297,033.42</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">↑ 100% vs mes ant.</div>
          </div>
          <div class="p-3.5 ref-card space-y-1">
            <div class="text-[10px] text-zinc-500 font-medium uppercase">Pedidos</div>
            <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white">23</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">↑ 100% vs mes ant.</div>
          </div>
          <div class="p-3.5 ref-card space-y-1">
            <div class="text-[10px] text-zinc-500 font-medium uppercase">Ticket promedio</div>
            <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white">RD$ 12,914.50</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">↑ 100% vs mes ant.</div>
          </div>
          <div class="p-3.5 ref-card space-y-1">
            <div class="text-[10px] text-zinc-500 font-medium uppercase">Clientes activos</div>
            <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white">3</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">↑ 100% vs mes ant.</div>
          </div>
          <div class="p-3.5 ref-card space-y-1">
            <div class="text-[10px] text-zinc-500 font-medium uppercase">Clientes nuevos</div>
            <div class="text-base font-extrabold font-mono text-zinc-900 dark:text-white">3</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">↑ 100% vs mes ant.</div>
          </div>
          <div class="p-3.5 ref-card space-y-1">
            <div class="text-[10px] text-zinc-500 font-medium uppercase">Tasa de éxito</div>
            <div class="text-base font-extrabold font-mono text-emerald-500">100%</div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">↑ 100% vs mes ant.</div>
          </div>
        </div>
      </template>
    </div>

    <!-- 2. MIDDLE CHARTS ROW -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      <!-- Left: Evolución de ingresos (Curva de Ingresos) -->
      <div class="lg:col-span-7 ref-card overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">📈</span>
            <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Evolución de ingresos</h3>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            ↑ +757.1% vs. punto anterior
          </span>
        </div>

        <div class="p-5">
          <!-- ⚡ Flickerless -->
          <template v-if="mode === 'flickerless'">
            <FlickerlessSurface :loading="loading" :settled="!isColdStart" :preserve-height="true">

              <div class="h-44 flex flex-col justify-between relative">
                <template v-if="!isColdStart">
                <div class="relative z-10 h-32 flex items-center justify-center">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 320 110" preserveAspectRatio="none">
                    <path d="M0,80 Q40,15 80,45 T160,85 T240,65 T320,90 L320,110 L0,110 Z" fill="url(#ingresos-grad)" />
                    <path d="M0,80 Q40,15 80,45 T160,85 T240,65 T320,90" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />
                    <!-- Points -->
                    <circle cx="80" cy="45" r="4.5" fill="#10b981" class="shadow-sm" />
                    <circle cx="240" cy="65" r="4.5" fill="#10b981" class="shadow-sm" />
                    <circle cx="320" cy="90" r="4.5" fill="#10b981" class="shadow-sm" />
                    <defs>
                      <linearGradient id="ingresos-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#10b981" stop-opacity="0.28" />
                        <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div class="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span>2026-06-04 · <strong>RD$ 62,621.92</strong></span>
                  <span>2026-09-29 · <strong>RD$ 11,999.94</strong></span>
                </div>
                </template>
              </div>
            </FlickerlessSurface>
          </template>

          <!-- 💀 Skeleton Clásico -->
          <template v-else>
            <div v-if="loading" class="h-44 flex items-center justify-center">
              <div class="classic-skeleton-box w-full h-36 rounded-xl"></div>
            </div>
            <div v-else class="h-44 flex flex-col justify-between relative">
              <div class="relative z-10 h-32 flex items-center justify-center">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 320 110" preserveAspectRatio="none">
                  <path d="M0,80 Q40,15 80,45 T160,85 T240,65 T320,90 L320,110 L0,110 Z" fill="rgba(16,185,129,0.2)" />
                  <path d="M0,80 Q40,15 80,45 T160,85 T240,65 T320,90" fill="none" stroke="#10b981" stroke-width="2.5" />
                </svg>
              </div>
              <div class="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span>2026-06-04 · <strong>RD$ 62,621.92</strong></span>
                <span>2026-09-29 · <strong>RD$ 11,999.94</strong></span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Right: Resumen Comercial -->
      <div class="lg:col-span-5 ref-card overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">📊</span>
            <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Resumen comercial</h3>
          </div>
        </div>

        <div class="p-5">
          <template v-if="mode === 'flickerless'">
            <FlickerlessSurface :loading="loading" :settled="!isColdStart" :preserve-height="true">

              <div class="space-y-4 text-xs">
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <div class="text-[10px] text-zinc-500">Pedidos</div>
                    <div class="text-sm font-bold font-mono mt-0.5"><FlickerlessValue value="23" /></div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <div class="text-[10px] text-zinc-500">Clientes activos</div>
                    <div class="text-sm font-bold font-mono mt-0.5"><FlickerlessValue value="3" /></div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <div class="text-[10px] text-zinc-500">Nuevos</div>
                    <div class="text-sm font-bold font-mono mt-0.5"><FlickerlessValue value="3" /></div>
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-zinc-500">Tasa de éxito</span>
                    <strong class="text-emerald-500">100%</strong>
                  </div>
                  <div class="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full w-full"></div>
                  </div>
                  <div class="text-[10px] text-zinc-400">Pedidos completados sobre el total del período.</div>
                </div>

                <div class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <span class="text-zinc-500">Ticket promedio</span>
                  <span class="font-mono font-bold text-zinc-900 dark:text-zinc-100"><FlickerlessValue value="RD$ 12,914.50" /></span>
                </div>
              </div>
            </FlickerlessSurface>
          </template>

          <template v-else>
            <div v-if="loading" class="space-y-3">
              <div class="classic-skeleton-box h-16 w-full rounded-xl"></div>
              <div class="classic-skeleton-box h-3 w-full rounded-full"></div>
              <div class="classic-skeleton-box h-10 w-full rounded-xl"></div>
            </div>
            <div v-else class="space-y-4 text-xs">
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div class="text-[10px] text-zinc-500">Pedidos</div>
                  <div class="text-sm font-bold font-mono mt-0.5">23</div>
                </div>
                <div class="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div class="text-[10px] text-zinc-500">Clientes activos</div>
                  <div class="text-sm font-bold font-mono mt-0.5">3</div>
                </div>
                <div class="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div class="text-[10px] text-zinc-500">Nuevos</div>
                  <div class="text-sm font-bold font-mono mt-0.5">3</div>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-zinc-500">Tasa de éxito</span>
                  <strong class="text-emerald-500">100%</strong>
                </div>
                <div class="w-full h-2 rounded-full bg-emerald-500"></div>
              </div>
              <div class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span class="text-zinc-500">Ticket promedio</span>
                <span class="font-mono font-bold">RD$ 12,914.50</span>
              </div>
            </div>
          </template>
        </div>
      </div>

    </div>

    <!-- 3. BOTTOM RANKINGS: PRODUCTOS & CLIENTES DESTACADOS -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      <!-- Productos destacados -->
      <div class="ref-card p-5 space-y-3">
        <div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div class="flex items-center gap-2">
            <span>📦</span>
            <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Productos destacados</h3>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500">10</span>
          </div>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Ver productos ›</span>
        </div>

        <template v-if="mode === 'flickerless'">
          <FlickerlessSurface :loading="loading" :settled="!isColdStart">
            <div class="space-y-2.5">
              <div class="p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-[11px]">1</span>
                  <div>
                    <div class="font-bold text-zinc-900 dark:text-zinc-100">300 Touring</div>
                    <div class="text-[10px] text-zinc-400">5 uds · RD$ 144,999.95</div>
                  </div>
                </div>
                <span class="font-mono font-bold text-zinc-900 dark:text-zinc-100"><FlickerlessValue value="RD$ 144,999.95" /></span>
              </div>

              <div class="p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold flex items-center justify-center text-[11px]">2</span>
                  <div>
                    <div class="font-bold text-zinc-900 dark:text-zinc-100">Rolex Submariner Watch</div>
                    <div class="text-[10px] text-zinc-400">10 uds · RD$ 139,999.90</div>
                  </div>
                </div>
                <span class="font-mono font-bold text-zinc-900 dark:text-zinc-100"><FlickerlessValue value="RD$ 139,999.90" /></span>
              </div>
            </div>
          </FlickerlessSurface>
        </template>

        <template v-else>
          <div v-if="loading" class="space-y-2">
            <div class="classic-skeleton-box h-12 w-full rounded-xl"></div>
            <div class="classic-skeleton-box h-12 w-full rounded-xl"></div>
          </div>
          <div v-else class="space-y-2.5">
            <div class="p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span class="font-bold">300 Touring</span>
              <span class="font-mono font-bold">RD$ 144,999.95</span>
            </div>
            <div class="p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span class="font-bold">Rolex Submariner Watch</span>
              <span class="font-mono font-bold">RD$ 139,999.90</span>
            </div>
          </div>
        </template>
      </div>

      <!-- Clientes destacados -->
      <div class="ref-card p-5 space-y-3">
        <div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div class="flex items-center gap-2">
            <span>👥</span>
            <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Clientes destacados</h3>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500">3</span>
          </div>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Ver clientes ›</span>
        </div>

        <template v-if="mode === 'flickerless'">
          <FlickerlessSurface :loading="loading" :settled="!isColdStart">
            <div class="space-y-2.5">
              <div class="p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center text-[11px]">1</span>
                  <div>
                    <div class="font-bold text-zinc-900 dark:text-zinc-100">Luis Taveras</div>
                    <div class="text-[10px] text-zinc-400">13 pedidos</div>
                  </div>
                </div>
                <span class="font-mono font-bold text-zinc-900 dark:text-zinc-100"><FlickerlessValue value="RD$ 200,301.25" /></span>
              </div>

              <div class="p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold flex items-center justify-center text-[11px]">2</span>
                  <div>
                    <div class="font-bold text-zinc-900 dark:text-zinc-100">Juana de Arco</div>
                    <div class="text-[10px] text-zinc-400">8 pedidos</div>
                  </div>
                </div>
                <span class="font-mono font-bold text-zinc-900 dark:text-zinc-100"><FlickerlessValue value="RD$ 67,944.39" /></span>
              </div>
            </div>
          </FlickerlessSurface>
        </template>

        <template v-else>
          <div v-if="loading" class="space-y-2">
            <div class="classic-skeleton-box h-12 w-full rounded-xl"></div>
            <div class="classic-skeleton-box h-12 w-full rounded-xl"></div>
          </div>
          <div v-else class="space-y-2.5">
            <div class="p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span class="font-bold">Luis Taveras (13 pedidos)</span>
              <span class="font-mono font-bold">RD$ 200,301.25</span>
            </div>
            <div class="p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span class="font-bold">Juana de Arco (8 pedidos)</span>
              <span class="font-mono font-bold">RD$ 67,944.39</span>
            </div>
          </div>
        </template>
      </div>

    </div>

  </div>
</template>
