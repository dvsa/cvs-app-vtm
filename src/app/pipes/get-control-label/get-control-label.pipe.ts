import { Pipe, PipeTransform } from '@angular/core';
import { FormNodeCombinationOptions, FormNodeOption } from '@services/dynamic-forms/dynamic-form.types';

@Pipe({ name: 'getControlLabel' })
export class GetControlLabelPipe implements PipeTransform {
	transform(
		value: string | number | null | undefined,
		options?: FormNodeOption<string | number | boolean | null>[] | FormNodeCombinationOptions | undefined
	): string | number | null | undefined {
		return (Array.isArray(options) && options?.find((option) => option.value === value)?.label) || value;
	}
}
