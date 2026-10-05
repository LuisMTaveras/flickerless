import React, { ReactNode } from 'react';
import { FlickerlessOptions } from '@flickerless/core';
import { useFlickerless } from './useFlickerless';

export interface FlickerlessSurfaceProps extends FlickerlessOptions {
  children: ReactNode;
  emptyState?: ReactNode;
  errorState?: ReactNode | ((err: any) => ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

export const FlickerlessSurface: React.FC<FlickerlessSurfaceProps> = ({
  children,
  emptyState,
  errorState,
  className = '',
  style,
  streamHeight,
  streamColor,
  ...options
}) => {
  const { isVisibleLoading, status, surfaceProps, bodyProps } = useFlickerless(options);

  const customStyles: React.CSSProperties = {
    ...style,
    ...(streamHeight ? { ['--flickerless-stream-height' as any]: streamHeight } : {}),
    ...(streamColor ? { ['--flickerless-stream-color' as any]: streamColor } : {}),
  };

  return (
    <div
      {...surfaceProps}
      className={`${surfaceProps.className} ${className}`.trim()}
      style={customStyles}
    >
      <div className="flickerless-stream" aria-hidden="true" />

      {status === 'error' && errorState ? (
        <div className="flickerless-error-state">
          {typeof errorState === 'function' ? errorState(options.error) : errorState}
        </div>
      ) : status === 'empty' && emptyState ? (
        <div className="flickerless-empty-state">{emptyState}</div>
      ) : (
        <div {...bodyProps}>{children}</div>
      )}
    </div>
  );
};
