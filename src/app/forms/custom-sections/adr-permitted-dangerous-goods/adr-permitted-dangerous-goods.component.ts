import { AfterContentInit, Component, OnDestroy, OnInit, input } from '@angular/core';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { MultiOptions } from '@models/options.model';
import { CustomFormGroup } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject, takeUntil } from 'rxjs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxGroupComponent } from '../../components/checkbox-group/checkbox-group.component';

@Component({
	selector: 'app-adr-permitted-dangerous-goods',
	templateUrl: './adr-permitted-dangerous-goods.component.html',
	styleUrls: ['./adr-permitted-dangerous-goods.component.scss'],
	imports: [CheckboxGroupComponent, FormsModule, ReactiveFormsModule],
})
export class AdrPermittedDangerousGoodsComponent
	extends BaseControlComponent
	implements OnInit, OnDestroy, AfterContentInit
{
	readonly parentForm = input<CustomFormGroup>();
	adrBodyType?: ADRBodyType;
	destroy$ = new ReplaySubject<boolean>(1);
	options?: MultiOptions = [];

	ngOnInit(): void {
		this.adrBodyType = this.parentForm()?.get('techRecord_adrDetails_vehicleDetails_type')?.value;
		this.options = this.getOptions();
		this.parentForm()
			?.valueChanges.pipe(takeUntil(this.destroy$))
			.subscribe((changes) => {
				const newBodyTypeValue = this.parentForm()?.get('techRecord_adrDetails_vehicleDetails_type')?.value;
				if (this.adrBodyType !== newBodyTypeValue) {
					this.adrBodyType = newBodyTypeValue;
					if (this.adrBodyType?.includes('battery') || this.adrBodyType?.includes('tank')) {
						let currentValue: string[] = this.control?.value?.value;
						if (
							currentValue &&
							(currentValue.includes(ADRDangerousGood.EXPLOSIVES_TYPE_2) ||
								currentValue.includes(ADRDangerousGood.EXPLOSIVES_TYPE_3))
						) {
							currentValue = currentValue.filter(
								(value) => value !== ADRDangerousGood.EXPLOSIVES_TYPE_3 && value !== ADRDangerousGood.EXPLOSIVES_TYPE_2
							);
							this.control?.value?.patchValue(currentValue);
						}
					}
					this.options = this.getOptions();
				}
			});
	}

	getOptions() {
		let enumValues = getOptionsFromEnum(ADRDangerousGood);
		if (this.adrBodyType?.includes('battery') || this.adrBodyType?.includes('tank')) {
			enumValues = enumValues.filter(
				(option) =>
					option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_3 && option.value !== ADRDangerousGood.EXPLOSIVES_TYPE_2
			);
		}
		return enumValues;
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
