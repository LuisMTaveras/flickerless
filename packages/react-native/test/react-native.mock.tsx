// Sustituto mínimo de react-native para probar la LÓGICA de la superficie en jsdom.
// No prueba el render nativo: View/Text/Animated.View son <div>/<span> con sus props a la vista.
import React from 'react';

type P = { children?: React.ReactNode; style?: unknown; accessibilityRole?: string; accessibilityState?: { busy?: boolean }; onLayout?: (e: unknown) => void; testID?: string };

const flat = (style: unknown): Record<string, unknown> =>
  Array.isArray(style) ? Object.assign({}, ...style.map(flat)) : style && typeof style === 'object' ? (style as Record<string, unknown>) : {};

export const View = ({ children, style, accessibilityRole, accessibilityState, onLayout, testID }: P) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    // jsdom no mide: el test fija la altura con data-height y dispara un layout.
    onLayout?.({ nativeEvent: { layout: { width: 300, height: Number(ref.current?.closest('[data-height]')?.getAttribute('data-height') ?? 0) } } });
  }, []);
  const s = flat(style);
  return (
    <div ref={ref} role={accessibilityRole} aria-busy={accessibilityState?.busy} data-testid={testID} data-min-height={s.minHeight as number | undefined} data-opacity={s.opacity as number | undefined}>
      {children}
    </div>
  );
};
export const Text = ({ children }: P) => <span>{children}</span>;

class AnimatedValue {
  constructor(public value: number) {}
  setValue(v: number) { this.value = v; }
  interpolate() { return 0; }
}
const timing = () => ({ start: () => undefined, stop: () => undefined });
export const Animated = { Value: AnimatedValue, View, timing, loop: () => ({ start: () => undefined, stop: () => undefined }) };
export const Easing = { bezier: () => () => 0 };
export const StyleSheet = { create: <T,>(s: T) => s };
export const AccessibilityInfo = {
  isReduceMotionEnabled: () => Promise.resolve(true),
  addEventListener: () => ({ remove: () => undefined }),
  announceForAccessibility: () => undefined,
};
