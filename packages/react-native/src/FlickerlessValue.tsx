import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { useFlickerlessColors } from './colors';
import { useSettled } from './settled';

export interface FlickerlessValueProps<T> {
  value?: T | null;
  /** Cómo se pinta el valor cuando existe. Sin él, `String(value)`. */
  children?: (value: T) => React.ReactNode;
  placeholder?: string;
  unknownLabel?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Un dato que puede no existir todavía. Sin respuesta pinta «—» atenuado en vez
 * de un cero: «RD$0.00» antes de cargar es una cifra falsa, no un hueco.
 * Desconocido = la superficie que lo envuelve aún no responde, o `value` es
 * null/undefined.
 */
export function FlickerlessValue<T>({ value, children, placeholder = '—', unknownLabel = 'Sin dato todavía', style }: FlickerlessValueProps<T>) {
  const settled = useSettled();
  const colors = useFlickerlessColors();
  if (value === null || value === undefined || settled === false) {
    return (
      <Text style={[style, { color: colors.unknown }]} accessibilityLabel={unknownLabel}>
        {placeholder}
      </Text>
    );
  }
  if (children) return <>{children(value)}</>;
  return <Text style={style}>{String(value)}</Text>;
}
