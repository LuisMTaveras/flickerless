import { defineComponent, h } from 'vue';

/**
 * Primitiva universal de carga de Flickerless.
 * Puede usarse como cualquier elemento (input, botón, avatar, línea de texto)
 * con la animación de haz de luz GPU a 110°.
 *
 * Ejemplos:
 * <FlickerlessSkeleton class="h-10 w-full rounded-lg" /> <!-- Input -->
 * <FlickerlessSkeleton class="h-9 w-28 rounded-md" />   <!-- Botón -->
 * <FlickerlessSkeleton class="w-12 h-12 rounded-full" /> <!-- Avatar -->
 * <FlickerlessSkeleton class="h-4 w-3/4 rounded" />      <!-- Línea de texto -->
 */
export const FlickerlessSkeleton = defineComponent({
  name: 'FlickerlessSkeleton',
  inheritAttrs: false,
  props: {
    as: { type: String, default: 'div' },
    class: { type: String, default: '' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          class: ['flickerless-skeleton', props.class, attrs.class as string]
            .filter(Boolean)
            .join(' '),
          'aria-hidden': 'true',
        },
        slots.default ? slots.default() : []
      );
  },
});
