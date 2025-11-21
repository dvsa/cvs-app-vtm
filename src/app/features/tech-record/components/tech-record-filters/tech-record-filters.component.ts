import { Component, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-tech-record-filters',
	templateUrl: './tech-record-filters.component.html',
	styleUrls: ['./tech-record-filters.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TechRecordFiltersComponent),
			multi: true,
		},
	],
})
export class TechRecordFiltersComponent implements ControlValueAccessor {
	value = model<string[]>([]);
	disabled = model<boolean>(false);
	tags = input.required<string[]>();

	onChange = (_: any) => {};
	onTouched = () => {};

	toggle(filter: string) {
		const filters = new Set(this.value());
		filters.has(filter) ? filters.delete(filter) : filters.add(filter);
		this.writeValue(Array.from(filters));
	}

	writeValue(obj: string[]): void {
		this.value.set(obj);
		this.onChange(obj);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}
}
