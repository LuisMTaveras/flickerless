import { defineComponent, h } from 'vue';

/**
 * Skeleton preconstruido para formularios (Drawers, Modales, Páginas de Ajustes).
 * Renderiza pares de etiqueta + campo de entrada con proporciones realistas y haz de 110°.
 *
 * Ejemplo:
 * <FlickerlessFormSkeleton :fields="6" :columns="2" />
 */
export const FlickerlessFormSkeleton = defineComponent({
  name: 'FlickerlessFormSkeleton',
  props: {
    fields: { type: Number, default: 4 },
    columns: { type: Number, default: 1 },
    showHeading: { type: Boolean, default: false },
    showActions: { type: Boolean, default: true },
  },
  setup(props) {
    return () => {
      const children = [];

      // 1. Heading opcional
      if (props.showHeading) {
        children.push(
          h('div', { class: 'space-y-1.5 mb-6' }, [
            h('div', { class: 'h-5 bg-zinc-800 rounded w-44' }),
            h('div', { class: 'h-3 bg-zinc-800/60 rounded w-64' }),
          ])
        );
      }

      // 2. Grid de campos de formulario
      const fieldElements = [];
      const labelWidths = ['w-24', 'w-32', 'w-20', 'w-28', 'w-36'];

      for (let i = 0; i < props.fields; i++) {
        const lw = labelWidths[i % labelWidths.length];
        fieldElements.push(
          h('div', { class: 'space-y-2' }, [
            // Label
            h('div', { class: `h-3 bg-zinc-800/80 rounded ${lw}` }),
            // Input box
            h('div', {
              class: 'h-10 w-full rounded-lg bg-zinc-900/60 border border-zinc-800/80',
            }),
          ])
        );
      }

      const gridClass = props.columns === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4';
      children.push(h('div', { class: gridClass }, fieldElements));

      // 3. Botones de acción inferiores
      if (props.showActions) {
        children.push(
          h('div', { class: 'flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/50 mt-6' }, [
            // Cancelar
            h('div', { class: 'h-9 w-20 rounded-md bg-zinc-800/60' }),
            // Guardar
            h('div', { class: 'h-9 w-28 rounded-md bg-zinc-800' }),
          ])
        );
      }

      return h('div', { class: 'shimmer-sweep-surface space-y-4' }, children);
    };
  },
});
