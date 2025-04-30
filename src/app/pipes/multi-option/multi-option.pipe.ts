import { Pipe, PipeTransform } from '@angular/core';
import { MultiOption } from '@models/options.model';
import { DefaultNullOrEmpty } from '../default-null-or-empty/default-null-or-empty.pipe';

@Pipe({ name: 'multiOption' })
export class MultiOptionPipe implements PipeTransform {
	transform(value: unknown, options: MultiOption<unknown>[]) {
		const option = options.find((o) => o.value === value);
		if (option) {
			return new DefaultNullOrEmpty().transform(option.label);
		}

		return '-';
	}
}
