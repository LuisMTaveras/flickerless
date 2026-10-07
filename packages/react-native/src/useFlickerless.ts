import { useEffect, useRef, useState } from 'react';
import { FlickerlessController, type FlickerlessStatus } from '@flickerless/core';

export interface UseFlickerlessOptions {
  loading: boolean;
  delayMs?: number;
  minDurationMs?: number;
  empty?: boolean;
  error?: boolean | string | Error | null;
}

/** El controlador anti-parpadeo de la web, con estado de React. */
export function useFlickerless({ loading, delayMs = 180, minDurationMs = 250, empty = false, error = null }: UseFlickerlessOptions) {
  const [isVisibleLoading, setVisible] = useState(false);
  const [status, setStatus] = useState<FlickerlessStatus>('idle');
  const controller = useRef<FlickerlessController | null>(null);

  if (!controller.current) {
    controller.current = new FlickerlessController({
      loading,
      delayMs,
      minDurationMs,
      empty,
      error,
      onStateChange: (state) => {
        setVisible(state.isVisibleLoading);
        setStatus(state.status);
      },
    });
  }

  useEffect(() => {
    controller.current?.update({ loading, delayMs, minDurationMs, empty, error });
  }, [loading, delayMs, minDurationMs, empty, error]);

  useEffect(() => () => controller.current?.destroy(), []);

  return { isVisibleLoading, status };
}
