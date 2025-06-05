import { NgClass, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, Component, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { DecimalOnlyDirective } from '@directives/app-decimal-only/app-decimal-only.directive';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { FieldWarningMessageComponent } from '../field-warning-message/field-warning-message.component';

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
	imports: [
		NgClass,
		TagComponent,
		FieldErrorMessageComponent,
		FieldWarningMessageComponent,
		NgTemplateOutlet,
		FormsModule,
		NumberOnlyDirective,
		DecimalOnlyDirective,
	],
})
export class NumberInputComponent extends BaseControlComponent implements AfterContentInit {
	readonly vehicleType = input<string | null>();
	readonly enableDecimals = input<boolean | undefined>(false);
	get style(): string {
		const width = this.width();
		return `govuk-input ${width ? `govuk-input--width-${width}` : ''}`;
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
		return this.label() === 'Length' && Number.parseInt(this.value, 10) > 12000;
	}

	// @TODO: remove this when dimensions feature flag is removed
	shouldDisplayWidthWarning(): boolean {
		return this.label() === 'Width' && Number.parseInt(this.value, 10) > 2600;
	}

	// @TODO: remove this when dimensions feature flag is removed
	isCorrectVehicleType(): boolean {
		const vehicleType = this.vehicleType();
		return vehicleType === 'hgv' || vehicleType === 'trl';
	}

	override ngAfterContentInit(): void {
		super.ngAfterContentInit();
		if (this.control) {
			this.control.meta.customId = this.name();
		}
	}
}
