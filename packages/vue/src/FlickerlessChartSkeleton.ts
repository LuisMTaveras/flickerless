import { defineComponent, h, PropType } from 'vue';

export const FlickerlessChartSkeleton = defineComponent({
  name: 'FlickerlessChartSkeleton',
  props: {
    type: { type: String as PropType<'bars' | 'area'>, default: 'bars' },
    height: { type: String, default: 'h-48' },
    barsCount: { type: Number, default: 8 },
  },
  setup(props) {
    const BAR_HEIGHTS = [65, 85, 40, 92, 70, 88, 58, 76, 50, 80, 60, 90];

    return () => {
      // 1. Bar Chart Skeleton
      if (props.type === 'bars') {
        const bars = [];
        for (let i = 0; i < props.barsCount; i++) {
          const hPct = BAR_HEIGHTS[i % BAR_HEIGHTS.length];
          bars.push(
            h('div', { class: 'flex-1 flex flex-col items-center justify-end h-full' }, [
              h('div', {
                class: 'sk-chart-bar',
                style: { height: `${hPct}%` },
              }),
            ])
          );
        }

        return h('div', { class: `w-full ${props.height} flex flex-col justify-between relative shimmer-sweep-surface p-3` }, [
          h('div', { class: 'linear-stream-track absolute top-0 left-0 right-0' }, [
            h('div', { class: 'linear-stream-bar' }),
          ]),
          h('div', { class: 'absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 pt-6 pb-8 px-4' }, [
            h('div', { class: 'sk-grid-line' }),
            h('div', { class: 'sk-grid-line' }),
            h('div', { class: 'sk-grid-line' }),
          ]),
          h('div', { class: 'relative z-10 h-32 flex items-end justify-between gap-2 px-2 pt-4' }, bars),
          h('div', { class: 'h-4 border-t border-zinc-800/80' }),
        ]);
      }

      // 2. Area Chart Skeleton
      return h('div', { class: `w-full ${props.height} flex flex-col justify-between relative shimmer-sweep-surface p-3` }, [
        h('div', { class: 'linear-stream-track absolute top-0 left-0 right-0' }, [
          h('div', { class: 'linear-stream-bar' }),
        ]),
        h('div', { class: 'relative z-10 h-36 flex items-center justify-center pt-4' }, [
          h('svg', { class: 'w-full h-full overflow-visible', viewBox: '0 0 300 120', preserveAspectRatio: 'none' }, [
            h('path', { d: 'M0,90 Q50,30 100,70 T200,40 T300,20', class: 'flickerless-chart-curve' }),
            h('path', { d: 'M0,90 Q50,30 100,70 T200,40 T300,20 L300,120 L0,120 Z', fill: 'var(--skeleton-base)', opacity: '0.15' }),
          ]),
        ]),
        h('div', { class: 'h-4 border-t border-zinc-800/80' }),
      ]);
    };
  },
});
