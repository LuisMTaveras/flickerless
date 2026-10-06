import { defineComponent, h } from 'vue';

export const FlickerlessTableSkeleton = defineComponent({
  name: 'FlickerlessTableSkeleton',
  props: {
    rows: { type: Number, default: 6 },
    columns: { type: Number, default: 8 },
    showAvatar: { type: Boolean, default: true },
  },
  setup(props) {
    return () => {
      const rowElements = [];

      for (let i = 0; i < props.rows; i++) {
        const cells = [];
        for (let j = 0; j < props.columns; j++) {
          if (j === 0) {
            // Checkbox
            cells.push(
              h('td', { class: 'py-3 px-3 text-center' }, [
                h('div', { class: 'w-4 h-4 mx-auto rounded border border-zinc-700 bg-transparent' }),
              ])
            );
          } else if (j === 1) {
            // Code
            cells.push(
              h('td', { class: 'py-3 px-3.5 font-mono' }, [
                h('div', { class: 'h-3.5 bg-zinc-800 rounded w-16' }),
              ])
            );
          } else if (j === 2 && props.showAvatar) {
            // Primary entity with avatar & two lines
            cells.push(
              h('td', { class: 'py-3 px-3.5' }, [
                h('div', { class: 'flex items-center gap-2.5' }, [
                  h('div', { class: 'w-7 h-7 rounded-full bg-zinc-800 shrink-0' }),
                  h('div', { class: 'space-y-1 w-full max-w-[200px]' }, [
                    h('div', { class: 'h-3.5 bg-zinc-800 rounded w-36' }),
                    h('div', { class: 'h-2 bg-zinc-800/60 rounded w-20' }),
                  ]),
                ]),
              ])
            );
          } else if (j === props.columns - 1) {
            // Action button / Status badge
            cells.push(
              h('td', { class: 'py-3 px-3.5 text-center' }, [
                h('div', { class: 'h-5 w-16 rounded-full bg-zinc-800 mx-auto' }),
              ])
            );
          } else {
            // Proportional variable widths
            const widths = ['w-24', 'w-20', 'w-28', 'w-16', 'w-32'];
            const w = widths[(i + j) % widths.length];
            const isRightAligned = j === props.columns - 2 || j === props.columns - 3;
            cells.push(
              h('td', { class: `py-3 px-3.5 ${isRightAligned ? 'text-right' : ''}` }, [
                h('div', { class: `h-3.5 bg-zinc-800 rounded ${w} ${isRightAligned ? 'ml-auto' : ''}` }),
              ])
            );
          }
        }
        rowElements.push(h('tr', { class: 'border-b border-zinc-800/50' }, cells));
      }

      return h('tbody', { class: 'shimmer-sweep-surface divide-y divide-zinc-800/50' }, rowElements);
    };
  },
});
