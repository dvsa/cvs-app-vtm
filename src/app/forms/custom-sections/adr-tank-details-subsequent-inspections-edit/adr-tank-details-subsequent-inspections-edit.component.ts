import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { TC3Types } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tc3Types.enum.js';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { ValidatorNames } from '@models/validators.enum';
import {
	CustomFormControl,
	CustomFormGroup,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
} from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

import { DateComponent } from '../../components/date/date.component';
import { SelectComponent } from '../../components/select/select.component';
import { TextInputComponent } from '../../components/text-input/text-input.component';

@Component({
	selector: 'app-adr-tank-details-subsequent-inspections',
	templateUrl: './adr-tank-details-subsequent-inspections-edit.component.html',
	styleUrls: ['./adr-tank-details-subsequent-inspections-edit.component.scss'],
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: AdrTankDetailsSubsequentInspectionsEditComponent, multi: true },
	],
	imports: [FormsModule, ReactiveFormsModule, SelectComponent, TextInputComponent, DateComponent],
})
export class AdrTankDetailsSubsequentInspectionsEditComponent
	extends CustomFormControlComponent
	implements OnInit, OnDestroy, AfterContentInit
{
	destroy$ = new ReplaySubject<boolean>(1);

	formArray = new FormArray<CustomFormGroup>([]);

	ngOnInit() {
		this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
			this.control?.patchValue(changes, { emitModelToViewChange: true });
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	override ngAfterContentInit() {
		super.ngAfterContentInit();
		if (this.form) {
			const value = this.form?.get(this.name())?.value;
			const values = Array.isArray(value) && value.length ? value : [];

			values.forEach(
				(formValue: { tc3Type: string; tc3PeriodicNumber: string; tc3PeriodicExpiryDate: string }, index: number) => {
					const control = this.createSubsequentInspection(index);
					control.patchValue(formValue);
					this.formArray.push(control);
				}
			);
		}
	}

	createSubsequentInspection(index: number) {
		const newFormGroup = new CustomFormGroup(
			{
				name: index.toString(),
				label: 'Subsequent',
				type: FormNodeTypes.GROUP,
				customId: `subsequent[${index}]`,
				validators: [{ name: ValidatorNames.Tc3TestValidator }],
				children: [
					{
						name: 'tc3Type',
						type: FormNodeTypes.CONTROL,
						label: 'TC3: Inspection Type',
						options: getOptionsFromEnum(TC3Types),
						customId: `tc3Type[${index}]`,
					},
					{
						name: 'tc3PeriodicNumber',
						label: 'TC3: Certificate Number',
						type: FormNodeTypes.CONTROL,
						customId: `tc3PeriodicNumber[${index}]`,
					},
					{
						name: 'tc3PeriodicExpiryDate',
						label: 'TC3: Expiry Date',
						type: FormNodeTypes.CONTROL,
						editType: FormNodeEditTypes.DATE,
						viewType: FormNodeViewTypes.DATE,
						customId: `tc3PeriodicExpiryDate[${index}]`,
					},
				],
			},
			{
				tc3Type: new CustomFormControl({
					name: 'tc3Type',
					type: FormNodeTypes.CONTROL,
				}),
				tc3PeriodicNumber: new CustomFormControl({
					name: 'tc3PeriodicNumber',
					type: FormNodeTypes.CONTROL,
				}),
				tc3PeriodicExpiryDate: new CustomFormControl({
					name: 'tc3PeriodicExpiryDate',
					type: FormNodeTypes.CONTROL,
				}),
			}
		);

		newFormGroup.get('tc3PeriodicNumber')?.addValidators(Validators.maxLength(75));
		newFormGroup
			.get('tc3PeriodicExpiryDate')
			?.addValidators(CustomValidators.tc3TestValidator({ inspectionNumber: index + 1 }));
		newFormGroup
			.get('tc3PeriodicNumber')
			?.addValidators(CustomValidators.tc3TestValidator({ inspectionNumber: index + 1 }));
		newFormGroup.get('tc3Type')?.addValidators(CustomValidators.tc3TestValidator({ inspectionNumber: index + 1 }));

		return newFormGroup;
	}

	addSubsequentInspection() {
		this.formArray.push(this.createSubsequentInspection(this.formArray.length));
	}

	removeSubsequentInspection(index: number) {
		this.formArray.removeAt(index);
	}

	handleChanges(index: number): void {
		this.formArray.controls[`${index}`].markAllAsTouched();
		this.formArray.controls[`${index}`].get('tc3Type')?.updateValueAndValidity();
		this.formArray.controls[`${index}`].get('tc3PeriodicNumber')?.updateValueAndValidity();
		this.formArray.controls[`${index}`].get('tc3PeriodicExpiryDate')?.updateValueAndValidity();
	}
}
