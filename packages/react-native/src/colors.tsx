import React, { createContext, useContext } from 'react';

export interface FlickerlessColors {
  /** La barra que avanza mientras carga. */
  stream: string;
  /** El riel bajo la barra. */
  track: string;
  /** El «—» de un dato que aún no existe. */
  unknown: string;
  /** El aviso de una carga fallida. Opcional: sin él, un rojo neutro. */
  danger?: string;
}

/** Rojo neutro del aviso de error cuando el tema no trae `danger`. */
export const DEFAULT_DANGER = 'rgba(220, 38, 38, 1)';

// Neutros sin marca: la app los sustituye por los de su tema con el proveedor.
const NEUTRAL: FlickerlessColors = {
  stream: 'rgba(127, 127, 127, 0.9)',
  track: 'rgba(127, 127, 127, 0.18)',
  unknown: 'rgba(127, 127, 127, 0.7)',
  danger: DEFAULT_DANGER,
};

const ColorsContext = createContext<FlickerlessColors>(NEUTRAL);

export function FlickerlessColorsProvider({ value, children }: { value: FlickerlessColors; children: React.ReactNode }) {
  return <ColorsContext.Provider value={value}>{children}</ColorsContext.Provider>;
}

export const useFlickerlessColors = () => useContext(ColorsContext);
