import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useFlickerless } from './useFlickerless';
import { useFlickerlessColors } from './colors';
import { SettledContext } from './settled';

export interface FlickerlessSurfaceProps {
  loading: boolean;
  /**
   * Si los datos ya respondieron alguna vez. Sin respuesta no se sabe nada:
   * ni «vacío» ni «cero» son verdad todavía. Sin la prop se deduce: la
   * superficie queda resuelta cuando una carga termina sin error.
   */
  settled?: boolean;
  empty?: boolean;
  error?: boolean | string | Error | null;
  delayMs?: number;
  minDurationMs?: number;
  /** Lo que se pinta con una respuesta vacía. Nunca durante la carga. */
  renderEmpty?: () => React.ReactNode;
  children?: React.ReactNode | ((state: { settled: boolean }) => React.ReactNode);
  style?: StyleProp<ViewStyle>;
  /** Ocupa el alto disponible (para una FlatList o un ScrollView dentro). */
  fill?: boolean;
  /** Texto para el lector de pantalla mientras el indicador está visible. */
  announceText?: string;
}

const ATTENUATED = 0.52;
const STREAM_WIDTH = 0.32;

/**
 * Carga sin skeleton ni spinner que tape la pantalla: el contenido que ya
 * estaba se queda, atenuado, con una barra de 2 px arriba. Una respuesta más
 * rápida que `delayMs` no enseña ningún indicador.
 */
export function FlickerlessSurface({
  loading,
  settled: settledProp,
  empty = false,
  error = null,
  delayMs = 180,
  minDurationMs = 250,
  renderEmpty,
  children,
  style,
  fill = false,
  announceText = 'Actualizando',
}: FlickerlessSurfaceProps) {
  const { isVisibleLoading } = useFlickerless({ loading, delayMs, minDurationMs, empty, error });
  const colors = useFlickerlessColors();

  const [loadFinished, setLoadFinished] = useState(!loading && !error);
  useEffect(() => {
    if (!loading && !error) setLoadFinished(true);
  }, [loading, error]);
  const settled = settledProp ?? loadFinished;

  const [width, setWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => alive && setReduceMotion(value))
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isVisibleLoading ? ATTENUATED : 1,
      duration: reduceMotion ? 0 : 180,
      useNativeDriver: true,
    }).start();
  }, [isVisibleLoading, reduceMotion, opacity]);

  useEffect(() => {
    if (!isVisibleLoading || reduceMotion || !width) return;
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, { toValue: 1, duration: 1350, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [isVisibleLoading, reduceMotion, width, progress]);

  useEffect(() => {
    if (isVisibleLoading) AccessibilityInfo.announceForAccessibility(announceText);
  }, [isVisibleLoading, announceText]);

  const showEmpty = settled && !loading && empty && renderEmpty;
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-width * STREAM_WIDTH, width] });

  return (
    <SettledContext.Provider value={settled}>
      <View style={[fill && styles.fill, style]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityState={{ busy: isVisibleLoading }}>
        <View style={[styles.track, { backgroundColor: isVisibleLoading ? colors.track : 'transparent' }]} pointerEvents="none">
          {isVisibleLoading ? (
            <Animated.View
              style={[
                styles.stream,
                { width: width * STREAM_WIDTH, backgroundColor: colors.stream },
                reduceMotion ? { opacity: 0.5 } : { transform: [{ translateX }] },
              ]}
            />
          ) : null}
        </View>
        <Animated.View style={[fill && styles.fill, { opacity }]}>
          {showEmpty ? renderEmpty() : typeof children === 'function' ? children({ settled }) : children}
        </Animated.View>
      </View>
    </SettledContext.Provider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  track: { height: 2, overflow: 'hidden' },
  stream: { height: 2, borderRadius: 999 },
});
