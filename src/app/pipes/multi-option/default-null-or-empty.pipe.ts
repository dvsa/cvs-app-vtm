import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'multiOption' })
export class MultiOptionPipe implements PipeTransform {
	titleCaseFirstWord(value: string) {
		return value[0].toUpperCase() + value.substring(1);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transform(value: any) {
		return '';
	}
}
