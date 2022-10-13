import { FormNodeOption } from '@forms/services/dynamic-form.types';

export default function getOptionsFromObject(object: object): FormNodeOption<string | number | boolean>[] {
  return Object.values(object).map(value => {
    return { value: value, label: value };
  });
}
