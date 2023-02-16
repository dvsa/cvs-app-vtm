import { MultiOptions } from '@forms/models/options.model';

export function getOptionsFromEnum(object: object): MultiOptions {
  return Object.values(object).map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));
}

export function getOptionsFromEnumOneChar(object: object): MultiOptions {
  return Object.values(object).map(value => ({ value, label: value.charAt(0).toUpperCase() }));
}

export function getOptionsFromEnumAcronym(object: object): MultiOptions {
  return Object.values(object).map(value => ({ value, label: value.toUpperCase() }));
}
