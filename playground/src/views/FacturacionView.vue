<script setup lang="ts">
import { ref } from 'vue';
import { FlickerlessSurface, FlickerlessTableShell } from '@flickerless/vue';
import { MOCK_INVOICES, type Invoice } from '../mockData';

const props = defineProps<{
  mode: 'flickerless' | 'skeleton';
  loading: boolean;
  isColdStart: boolean;
}>();

const emit = defineEmits<{
  (e: 'refetch'): void;
}>();

// Estado local
const showEmptyState = ref(false);
const activeTab = ref('Todas');
const search = ref('');
const savingId = ref<string | null>(null);

function simulateSave(id: string) {
  if (savingId.value) return;
  savingId.value = id;
  setTimeout(() => {
    savingId.value = null;
  }, 1200);
}

function getFacturas(): Invoice[] {
  if (showEmptyState.value) return [];
  return MOCK_INVOICES.filter((inv) => {
    const matchesTab =
      activeTab.value === 'Todas' ||
      (activeTab.value === 'Borradores' && inv.status === 'Borrador') ||
      (activeTab.value === 'Emitidas' && inv.status === 'Emitida') ||
      (activeTab.value === 'Rechazadas DGII' && inv.status === 'Rechazada DGII') ||
      (activeTab.value === 'Anuladas' && inv.status === 'Anulada');

    const matchesSearch =
      !search.value ||
      inv.number.toLowerCase().includes(search.value.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.value.toLowerCase()) ||
      inv.ncf.toLowerCase().includes(search.value.toLowerCase());

    return matchesTab && matchesSearch;
  });
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(val);
}
</script>

<template>
  <div class="space-y-5">
    
    <!-- SUBHEADER BAR -->
    <div class="p-3.5 ref-card flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
          🧾
        </div>
        <div>
          <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Facturación</h2>
          <p class="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">VENTAS › OPERACIÓN</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div class="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
          🏢 Sucursal: <strong class="text-zinc-900 dark:text-zinc-200 font-sans">Snowir Corp Suc Moca</strong>
        </div>

        <!-- Toggle Empty State vs Populated Data -->
        <button
          @click="showEmptyState = !showEmptyState"
          class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer"
          :class="showEmptyState ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800'"
        >
          {{ showEmptyState ? '⚠️ Ver con Datos' : '🔍 Probar Estado Vacío' }}
        </button>

        <button 
          @click="emit('refetch')"
          class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          <span>Actualizar</span>
        </button>
      </div>
    </div>

    <!-- DATAGRID CARD (Fiel a la Captura 3) -->
    <div class="ref-card overflow-hidden">
      
      <!-- Tabs Bar -->
      <div class="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            v-for="tab in [
              { name: 'Todas', count: showEmptyState ? 0 : 6 },
              { name: 'Borradores', count: showEmptyState ? 0 : 2 },
              { name: 'Emitidas', count: showEmptyState ? 0 : 3 },
              { name: 'Rechazadas DGII', count: showEmptyState ? 0 : 1 },
              { name: 'Anuladas', count: 0 },
            ]"
            :key="tab.name"
            @click="activeTab = tab.name; emit('refetch')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-2"
            :class="activeTab === tab.name ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'"
          >
            <span>{{ tab.name }}</span>
            <span class="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              {{ tab.count }}
            </span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
            Exportar
          </button>
          <button class="px-3.5 py-1.5 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold transition shadow-sm">
            + Nueva factura
          </button>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 flex flex-wrap items-center justify-between gap-3">
        <div class="relative flex-1 min-w-[240px]">
          <input 
            v-model="search"
            type="text" 
            placeholder="Buscar por número, NCF o cliente..." 
            class="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500 transition shadow-sm"
          >
        </div>

        <div class="flex items-center gap-2 text-xs">
          <div class="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[11px]">
            Periodo: <strong>Hoy</strong>
          </div>
          <button class="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300">
            Más filtros
          </button>
        </div>
      </div>

      <!-- TABLE BODY -->
      <div class="overflow-x-auto">
        <!-- ⚡ MODO FLICKERLESS -->
        <template v-if="mode === 'flickerless'">
          <FlickerlessSurface 
            :loading="loading" 
            :settled="!isColdStart"
            :empty="getFacturas().length === 0" 
            :preserve-height="true"
          >

            <!-- Empty state (Fiel a la captura 3) -->
            <template #empty>
              <div class="py-20 text-center space-y-2">
                <div class="text-3xl text-zinc-400">📄</div>
                <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Sin facturas encontradas</h4>
                <p class="text-xs text-zinc-500">Crea la primera con "Nueva factura".</p>
              </div>
            </template>

            <!-- Filas reales (en recarga se atenúan al 50% sin saltar) -->
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="text-zinc-400 font-bold text-[11px] uppercase tracking-wider bg-zinc-50/70 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800">
                  <th class="py-3 px-4 w-10 text-center"><input type="checkbox" class="rounded"></th>
                  <th class="py-3 px-4">FACTURA</th>
                  <th class="py-3 px-4">CLIENTE</th>
                  <th class="py-3 px-4">COMPROBANTE</th>
                  <th class="py-3 px-4">VENCIMIENTO</th>
                  <th class="py-3 px-4 text-right">TOTAL</th>
                  <th class="py-3 px-4 text-right">SALDO</th>
                  <th class="py-3 px-4 text-center">ESTADO</th>
                  <th class="py-3 px-4 text-center w-24">MUTACIÓN</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono text-[11px]">
                <!-- Carga en frío: la tabla real con «—» en cada celda -->
                <FlickerlessTableShell v-if="isColdStart" :cols="9" :rows="6" cell-class="py-3.5 px-4" />
                <template v-else>
                <tr 
                  v-for="inv in getFacturas()" 
                  :key="inv.id"
                  v-flickerless-saving="savingId === inv.id"
                  class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors"
                >
                  <td class="py-3.5 px-4 text-center"><input type="checkbox" class="rounded"></td>
                  <td class="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">{{ inv.number }}</td>
                  <td class="py-3.5 px-4 font-sans font-semibold text-zinc-800 dark:text-zinc-200">{{ inv.client }}</td>
                  <td class="py-3.5 px-4 text-zinc-500">{{ inv.ncf }}</td>
                  <td class="py-3.5 px-4 text-zinc-500">{{ inv.dueDate }}</td>
                  <td class="py-3.5 px-4 text-right font-bold text-zinc-900 dark:text-zinc-100">{{ formatCurrency(inv.total) }}</td>
                  <td class="py-3.5 px-4 text-right" :class="inv.balance > 0 ? 'text-amber-500 font-semibold' : 'text-zinc-400'">
                    {{ inv.balance > 0 ? formatCurrency(inv.balance) : 'Saldado' }}
                  </td>
                  <td class="py-3.5 px-4 text-center font-sans">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border" :class="inv.status === 'Emitida' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'">
                      {{ inv.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-center font-sans">
                    <button 
                      @click="simulateSave(inv.id)"
                      class="px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer"
                      :class="savingId === inv.id ? 'bg-emerald-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'"
                    >
                      {{ savingId === inv.id ? 'Guardando...' : 'Guardar' }}
                    </button>
                  </td>
                </tr>
                </template>
              </tbody>
            </table>
          </FlickerlessSurface>
        </template>

        <!-- 💀 MODO SKELETON TRADICIONAL -->
        <template v-else>
          <div v-if="loading" class="p-6 space-y-4">
            <!-- 💀 El clásico parpadeo de cajas grises de 40 divs -->
            <div v-for="i in 6" :key="i" class="flex items-center justify-between gap-4 py-2 border-b border-zinc-100 dark:border-zinc-800/50">
              <div class="classic-skeleton-box h-4 w-16"></div>
              <div class="classic-skeleton-box h-4 w-40"></div>
              <div class="classic-skeleton-box h-4 w-28"></div>
              <div class="classic-skeleton-box h-4 w-20"></div>
              <div class="classic-skeleton-box h-4 w-24"></div>
              <div class="classic-skeleton-box h-5 w-16 rounded-full"></div>
            </div>
          </div>

          <div v-else-if="getFacturas().length === 0" class="py-20 text-center space-y-2">
            <div class="text-3xl text-zinc-400">📄</div>
            <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Sin facturas encontradas</h4>
            <p class="text-xs text-zinc-500">Crea la primera con "Nueva factura".</p>
          </div>

          <table v-else class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="text-zinc-400 font-bold text-[11px] uppercase tracking-wider bg-zinc-50/70 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800">
                <th class="py-3 px-4 w-10 text-center"><input type="checkbox" class="rounded"></th>
                <th class="py-3 px-4">FACTURA</th>
                <th class="py-3 px-4">CLIENTE</th>
                <th class="py-3 px-4">COMPROBANTE</th>
                <th class="py-3 px-4">VENCIMIENTO</th>
                <th class="py-3 px-4 text-right">TOTAL</th>
                <th class="py-3 px-4 text-right">SALDO</th>
                <th class="py-3 px-4 text-center">ESTADO</th>
                <th class="py-3 px-4 text-center w-24">MUTACIÓN</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono text-[11px]">
              <tr v-for="inv in getFacturas()" :key="inv.id">
                <td class="py-3.5 px-4 text-center"><input type="checkbox" class="rounded"></td>
                <td class="py-3.5 px-4 font-bold">{{ inv.number }}</td>
                <td class="py-3.5 px-4 font-sans font-semibold">{{ inv.client }}</td>
                <td class="py-3.5 px-4 text-zinc-500">{{ inv.ncf }}</td>
                <td class="py-3.5 px-4 text-zinc-500">{{ inv.dueDate }}</td>
                <td class="py-3.5 px-4 text-right font-bold">{{ formatCurrency(inv.total) }}</td>
                <td class="py-3.5 px-4 text-right">{{ formatCurrency(inv.balance) }}</td>
                <td class="py-3.5 px-4 text-center font-sans">{{ inv.status }}</td>
                <td class="py-3.5 px-4 text-center font-sans">
                  <button class="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded text-[11px]">Guardar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 flex items-center justify-between text-xs text-zinc-500">
        <span>Mostrando <strong>{{ getFacturas().length }}</strong> de <strong>{{ getFacturas().length }}</strong> facturas</span>
        <div class="flex items-center gap-1">
          <button class="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-400">‹</button>
          <span class="px-2 font-mono text-zinc-900 dark:text-zinc-100">1</span>
          <button class="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-400">›</button>
        </div>
      </div>

    </div>

  </div>
</template>
