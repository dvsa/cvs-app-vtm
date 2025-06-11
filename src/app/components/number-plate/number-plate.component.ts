import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-number-plate',
	templateUrl: './number-plate.component.html',
	styleUrls: ['./number-plate.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgClass, DefaultNullOrEmpty],
})
export class NumberPlateComponent {
	private vrmToDisplay: string | undefined;

	readonly isSecondary = input(false);
	@Input() set vrm(value: string | undefined) {
		// formatting: if the number plate is long enough, add a space before the final 3 characters
		if (value && value.length >= 5 && !this.isZNumber(value)) {
			this.vrmToDisplay = `${value.slice(0, value.length - 3)} ${value.slice(value.length - 3)}`;
		} else {
			this.vrmToDisplay = value;
		}
	}
	get vrm(): string | undefined {
		return this.vrmToDisplay;
	}

	isZNumber(vrm: string): boolean {
		return /^[0-9]{7}[zZ]$/.test(vrm);
	}
}
