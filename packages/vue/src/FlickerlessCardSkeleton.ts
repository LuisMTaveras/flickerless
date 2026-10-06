import { defineComponent, h, PropType } from 'vue';

export const FlickerlessCardSkeleton = defineComponent({
  name: 'FlickerlessCardSkeleton',
  props: {
    count: { type: Number, default: 4 },
    type: { type: String as PropType<'kpi' | 'contact' | 'simple'>, default: 'kpi' },
    columns: { type: Number, default: 4 },
  },
  setup(props) {
    return () => {
      const cards = [];

      for (let i = 0; i < props.count; i++) {
        if (props.type === 'kpi') {
          cards.push(
            h('div', { class: 'p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 relative overflow-hidden' }, [
              h('div', { class: 'flex items-center justify-between' }, [
                h('div', { class: 'h-3 bg-zinc-800 rounded w-24' }),
                h('div', { class: 'w-7 h-7 rounded-lg bg-zinc-800/80' }),
              ]),
              h('div', { class: 'space-y-1' }, [
                h('div', { class: 'h-7 bg-zinc-800 rounded w-32' }),
                h('div', { class: 'h-2.5 bg-zinc-800/60 rounded w-20' }),
              ]),
            ])
          );
        } else if (props.type === 'contact') {
          cards.push(
            h('div', { class: 'p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between relative overflow-hidden' }, [
              h('div', { class: 'flex items-center gap-3' }, [
                h('div', { class: 'w-10 h-10 rounded-full bg-zinc-800 shrink-0' }),
                h('div', { class: 'space-y-1.5' }, [
                  h('div', { class: 'h-3.5 bg-zinc-800 rounded w-28' }),
                  h('div', { class: 'h-2.5 bg-zinc-800/60 rounded w-20' }),
                ]),
              ]),
              h('div', { class: 'h-4 bg-zinc-800/80 rounded w-24' }),
            ])
          );
        } else {
          cards.push(
            h('div', { class: 'p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 relative overflow-hidden' }, [
              h('div', { class: 'h-4 bg-zinc-800 rounded w-1/3' }),
              h('div', { class: 'h-3 bg-zinc-800/70 rounded w-2/3' }),
              h('div', { class: 'h-8 bg-zinc-800/50 rounded w-full' }),
            ])
          );
        }
      }

      const gridClass =
        props.columns === 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : props.columns === 3
          ? 'grid-cols-1 md:grid-cols-3'
          : props.columns === 2
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1';

      return h(
        'div',
        {
          class: `shimmer-sweep-surface grid gap-4 ${gridClass}`,
        },
        cards
      );
    };
  },
});
