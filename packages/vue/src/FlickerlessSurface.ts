import { defineComponent, h, PropType } from 'vue';
import { useFlickerless } from './useFlickerless';

export const FlickerlessSurface = defineComponent({
  name: 'FlickerlessSurface',
  props: {
    loading: { type: Boolean, default: false },
    delayMs: { type: Number, default: 180 },
    minDurationMs: { type: Number, default: 250 },
    keepPreviousData: { type: Boolean, default: true },
    empty: { type: Boolean, default: false },
    error: { type: [Boolean, String, Object] as PropType<boolean | string | Error | null>, default: null },
    streamHeight: { type: String, default: undefined },
    streamColor: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    const { isVisibleLoading, status, surfaceProps, bodyProps } = useFlickerless(props);

    return () => {
      const style: Record<string, string> = {};
      if (props.streamHeight) style['--flickerless-stream-height'] = props.streamHeight;
      if (props.streamColor) style['--flickerless-stream-color'] = props.streamColor;

      const children = [];

      // 1. Stream bar
      children.push(h('div', { class: 'flickerless-stream', 'aria-hidden': 'true' }));

      // 2. Body or alternate states
      if (status.value === 'error' && slots.error) {
        children.push(h('div', { class: 'flickerless-error-state' }, slots.error({ error: props.error })));
      } else if (status.value === 'empty' && slots.empty) {
        children.push(h('div', { class: 'flickerless-empty-state' }, slots.empty()));
      } else {
        children.push(h('div', bodyProps.value, slots.default ? slots.default() : []));
      }

      return h('div', { ...surfaceProps.value, style }, children);
    };
  },
});
