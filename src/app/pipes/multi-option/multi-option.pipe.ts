import { Pipe, PipeTransform } from '@angular/core';
import { MultiOptions } from '../../models/options.model';

@Pipe({ name: 'multiOption' })
export class MultiOptionPipe implements PipeTransform {
	transform(value: unknown, options: MultiOptions) {
		const option = options.find((o) => o.value === value);
		if (option) {
			return option.label;
		}

		return '-';
	}
}
