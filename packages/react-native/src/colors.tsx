import React, { createContext, useContext } from 'react';

export interface FlickerlessColors {
  /** La barra que avanza mientras carga. */
  stream: string;
  /** El riel bajo la barra. */
  track: string;
  /** El «—» de un dato que aún no existe. */
  unknown: string;
}

// Neutros sin marca: la app los sustituye por los de su tema con el proveedor.
const NEUTRAL: FlickerlessColors = {
  stream: 'rgba(127, 127, 127, 0.9)',
  track: 'rgba(127, 127, 127, 0.18)',
  unknown: 'rgba(127, 127, 127, 0.7)',
};

const ColorsContext = createContext<FlickerlessColors>(NEUTRAL);

export function FlickerlessColorsProvider({ value, children }: { value: FlickerlessColors; children: React.ReactNode }) {
  return <ColorsContext.Provider value={value}>{children}</ColorsContext.Provider>;
}

export const useFlickerlessColors = () => useContext(ColorsContext);
