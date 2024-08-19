import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'defaultNullOrEmpty' })
export class DefaultNullOrEmpty implements PipeTransform {
	titleCaseFirstWord(value: string) {
		return value[0].toUpperCase() + value.substring(1);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transform(value: any) {
		if (typeof value === 'string') {
			if (value.toLowerCase() === 'true') {
				return 'Yes';
			}
			if (value.toLowerCase() === 'false') {
				return 'No';
			}
			return value.trim().length > 0 ? this.titleCaseFirstWord(value) : '-';
		}
		if (typeof value === 'boolean') {
			return value ? 'Yes' : 'No';
		}
		return value == null ? '-' : value;
	}
}
