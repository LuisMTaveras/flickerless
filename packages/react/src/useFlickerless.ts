import { useEffect, useRef, useState } from 'react';
import { FlickerlessController, FlickerlessOptions, FlickerlessStatus } from '@flickerless/core';

export interface UseFlickerlessReturn {
  isVisibleLoading: boolean;
  status: FlickerlessStatus;
  surfaceProps: {
    className: string;
    'data-loading': string;
    'data-status': FlickerlessStatus;
  };
  bodyProps: {
    className: string;
  };
}

export function useFlickerless(options: FlickerlessOptions): UseFlickerlessReturn {
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [status, setStatus] = useState<FlickerlessStatus>('idle');
  const controllerRef = useRef<FlickerlessController | null>(null);

  useEffect(() => {
    controllerRef.current = new FlickerlessController({
      ...options,
      onStateChange: (state) => {
        setIsVisibleLoading(state.isVisibleLoading);
        setStatus(state.status);
      },
    });

    return () => {
      controllerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.update(options);
  }, [options.loading, options.empty, options.error, options.delayMs, options.minDurationMs]);

  return {
    isVisibleLoading,
    status,
    surfaceProps: {
      className: 'flickerless-surface',
      'data-loading': isVisibleLoading ? 'true' : 'false',
      'data-status': status,
    },
    bodyProps: {
      className: 'flickerless-body',
    },
  };
}
