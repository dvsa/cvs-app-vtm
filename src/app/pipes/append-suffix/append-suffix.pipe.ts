import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appendSuffix' })
export class AppendSuffixPipe implements PipeTransform {
	transform(value: unknown, suffix: string): string {
		if (!value && value !== 0) return '-';
		const newValue = Number(value);
		if (Number.isNaN(newValue)) return '-';

		return `${newValue} ${suffix}`;
	}
}
