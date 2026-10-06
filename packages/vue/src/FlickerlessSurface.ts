import { defineComponent, h, PropType, ref, watch, computed } from 'vue';
import { useFlickerless } from './useFlickerless';
import { useFlickerlessQuery, type QueryLike } from './useFlickerlessQuery';

export const FlickerlessSurface = defineComponent({
  name: 'FlickerlessSurface',
  props: {
    loading: { type: Boolean, default: false },
    delayMs: { type: Number, default: 180 },
    minDurationMs: { type: Number, default: 250 },
    keepPreviousData: { type: Boolean, default: true },
    empty: { type: Boolean, default: false },
    error: { type: [Boolean, String, Object] as PropType<boolean | string | Error | null>, default: null },
    query: { type: Object as PropType<QueryLike | null>, default: null },
    preserveHeight: { type: Boolean, default: false },
    announce: { type: Boolean, default: true },
    announceText: { type: String, default: 'Cargando actualización de datos...' },
    streamHeight: { type: String, default: undefined },
    streamColor: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    // 1. Integración automática con TanStack Query / Vue Query / Pinia Colada si se pasa la prop :query
    const queryState = props.query ? useFlickerlessQuery(props.query) : null;

    const effectiveLoading = computed(() => {
      if (queryState) return queryState.loading.value;
      return props.loading;
    });

    const effectiveEmpty = computed(() => {
      if (queryState) return queryState.isEmpty.value;
      return props.empty;
    });

    const effectiveError = computed(() => {
      if (queryState) return queryState.error.value;
      return props.error;
    });

    const { isVisibleLoading, status, surfaceProps, bodyProps } = useFlickerless({
      get loading() {
        return effectiveLoading.value;
      },
      get delayMs() {
        return props.delayMs;
      },
      get minDurationMs() {
        return props.minDurationMs;
      },
      get keepPreviousData() {
        return props.keepPreviousData;
      },
      get empty() {
        return effectiveEmpty.value;
      },
      get error() {
        return effectiveError.value;
      },
    });

    // 2. Zero-CLS Height Preservation (bloqueo y transición suave de altura)
    const rootEl = ref<HTMLElement | null>(null);
    const lockedHeight = ref<number | null>(null);

    watch(isVisibleLoading, (isLoading, wasLoading) => {
      if (!props.preserveHeight) return;

      if (isLoading && !wasLoading && rootEl.value) {
        const rect = rootEl.value.getBoundingClientRect();
        if (rect.height > 0) {
          lockedHeight.value = Math.round(rect.height);
        }
      } else if (!isLoading && wasLoading) {
        setTimeout(() => {
          lockedHeight.value = null;
        }, 220);
      }
    });

    return () => {
      const style: Record<string, string> = {};
      if (props.streamHeight) style['--flickerless-stream-height'] = props.streamHeight;
      if (props.streamColor) style['--flickerless-stream-color'] = props.streamColor;
      if (lockedHeight.value) {
        style['minHeight'] = `${lockedHeight.value}px`;
      }

      const children = [];

      // 3. Accesibilidad para lectores de pantalla (a11y)
      if (props.announce) {
        children.push(
          h(
            'div',
            {
              class: 'flickerless-sr-only',
              'aria-live': 'polite',
              'aria-atomic': 'true',
              role: 'status',
            },
            isVisibleLoading.value ? props.announceText : ''
          )
        );
      }

      // 4. Barra lineal de progreso (2px)
      children.push(h('div', { class: 'flickerless-stream', 'aria-hidden': 'true' }));

      // 5. Orquestación inteligente de estados y slots:
      if (effectiveError.value && slots.error) {
        children.push(
          h('div', { class: 'flickerless-error-state' }, slots.error({ error: effectiveError.value }))
        );
      } else if (isVisibleLoading.value && effectiveEmpty.value && slots.skeleton) {
        // Carga inicial en frío usando slot #skeleton
        children.push(h('div', { class: 'flickerless-body' }, slots.skeleton()));
      } else if (!isVisibleLoading.value && effectiveEmpty.value && slots.empty) {
        // Estado vacío limpio usando slot #empty
        children.push(h('div', { class: 'flickerless-empty-state' }, slots.empty()));
      } else {
        // Contenido real con atenuación al 50% durante recargas
        children.push(h('div', bodyProps.value, slots.default ? slots.default() : []));
      }

      const surfaceClasses = [
        surfaceProps.value.class,
        props.preserveHeight ? 'flickerless-preserve-height' : '',
      ]
        .filter(Boolean)
        .join(' ');

      return h(
        'div',
        {
          ...surfaceProps.value,
          ref: rootEl,
          class: surfaceClasses,
          style,
        },
        children
      );
    };
  },
});
