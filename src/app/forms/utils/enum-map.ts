import { MultiOptions } from '@forms/models/options.model';

export default function getOptionsFromEnum(object: object): MultiOptions {
  return Object.values(object).map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));
}
