export interface Location {
  axleNumber?: number[];
  horizontal?: Location.Horizontal[];
  lateral?: Location.Lateral[];
  longitudinal?: Location.Longitudinal[];
  rowNumber?: number[];
  seatNumber?: number[];
  vertical?: Location.Vertical[];
}

export namespace Location {
  export type Vertical = 'upper' | 'lower';
  export const Vertical = {
    Upper: 'upper' as Vertical,
    Lower: 'lower' as Vertical
  };

  export type Horizontal = 'inner' | 'outer';
  export const Horizontal = {
    Inner: 'inner' as Horizontal,
    Outer: 'outer' as Horizontal
  };

  export type Lateral = 'nearside' | 'centre' | 'offside';
  export const Lateral = {
    Nearside: 'nearside' as Lateral,
    Centre: 'centre' as Lateral,
    Offside: 'offside' as Lateral
  };

  export type Longitudinal = 'front' | 'rear';
  export const Longitudinal = {
    Front: 'front' as Longitudinal,
    Rear: 'rear' as Longitudinal
  };
}
