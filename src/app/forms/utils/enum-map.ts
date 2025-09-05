import { MultiOptions } from '@models/options.model';

export function getOptionsFromEnum(object: object): MultiOptions {
	// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
	return Object.values(object).map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));
}

export function getOptionsFromEnumOneChar(object: object): MultiOptions {
	return Object.values(object).map((value) => ({ value, label: value.charAt(0).toUpperCase() }));
}

export function getOptionsFromEnumAcronym(object: object): MultiOptions {
	return Object.values(object).map((value) => ({ value, label: value.toUpperCase() }));
}

export function getSortedOptionsFromEnum(object: object): MultiOptions {
	return Object.values(object)
		.map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))
		.sort((a, b) => a.label.localeCompare(b.label));
}
