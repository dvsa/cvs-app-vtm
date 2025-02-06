import { AfterContentInit, Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
	selector: 'app-number-input',
	templateUrl: './number-input.component.html',
	styleUrls: ['./number-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: NumberInputComponent,
			multi: true,
		},
	],
})
export class NumberInputComponent extends BaseControlComponent implements AfterContentInit {
	@Input() vehicleType?: string | null;
	@Input() enableDecimals: boolean | undefined = false;
	get style(): string {
		return `govuk-input ${this.width ? `govuk-input--width-${this.width}` : ''}`;
	}

	// @TODO: remove this when dimensions feature flag is removed
	get getWarningMessage(): string {
		if (this.isCorrectVehicleType()) {
			if (this.shouldDisplayLengthWarning())
				return 'This length dimension field value is greater than 12,000mm. Check your input before proceeding';
			if (this.shouldDisplayWidthWarning())
				return 'This width dimension field value is greater than 2,600mm. Check your input before proceeding';
		}
		return '';
	}

	// @TODO: remove this when dimensions feature flag is removed
	shouldDisplayLengthWarning(): boolean {
		return this.label === 'Length' && Number.parseInt(this.value, 10) > 12000;
	}

	// @TODO: remove this when dimensions feature flag is removed
	shouldDisplayWidthWarning(): boolean {
		return this.label === 'Width' && Number.parseInt(this.value, 10) > 2600;
	}

	// @TODO: remove this when dimensions feature flag is removed
	isCorrectVehicleType(): boolean {
		return this.vehicleType === 'hgv' || this.vehicleType === 'trl';
	}

	override ngAfterContentInit(): void {
		super.ngAfterContentInit();
		if (this.control) {
			this.control.meta.customId = this.name;
		}
	}
}
