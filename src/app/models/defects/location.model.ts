export interface Location {
	axleNumber?: number[];
	horizontal?: Horizontal[];
	lateral?: Lateral[];
	longitudinal?: Longitudinal[];
	rowNumber?: number[];
	seatNumber?: number[];
	vertical?: Vertical[];
}

export type Vertical = 'upper' | 'lower';
export const VerticalEnum = {
	Upper: 'upper' as Vertical,
	Lower: 'lower' as Vertical,
};

export type Horizontal = 'inner' | 'outer';
export const HorizontalEnum = {
	Inner: 'inner' as Horizontal,
	Outer: 'outer' as Horizontal,
};

export type Lateral = 'nearside' | 'centre' | 'offside';
export const LateralEnum = {
	Nearside: 'nearside' as Lateral,
	Centre: 'centre' as Lateral,
	Offside: 'offside' as Lateral,
};

export type Longitudinal = 'front' | 'rear';
export const LongitudinalEnum = {
	Front: 'front' as Longitudinal,
	Rear: 'rear' as Longitudinal,
};
