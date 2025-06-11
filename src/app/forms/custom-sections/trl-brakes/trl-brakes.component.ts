import { NgTemplateOutlet } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, input, output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TrlBrakesTemplate } from '@forms/templates/trl/trl-brakes.template';
import { MultiOptions } from '@models/options.model';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@services/dynamic-forms/dynamic-form.types';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { SwitchableInputComponent } from '../../components/switchable-input/switchable-input.component';

@Component({
	selector: 'app-trl-brakes[vehicleTechRecord]',
	templateUrl: './trl-brakes.component.html',
	styleUrls: ['./trl-brakes.component.scss'],
	imports: [SwitchableInputComponent, NgTemplateOutlet],
})
export class TrlBrakesComponent implements OnInit, OnChanges, OnDestroy {
	dfs = inject(DynamicFormService);

	readonly vehicleTechRecord = input.required<TechRecordType<'trl'>>();
	readonly isEditing = input(false);
	readonly formChange = output();

	form!: CustomFormGroup;

	booleanOptions: MultiOptions = [
		{ value: true, label: 'Yes' },
		{ value: false, label: 'No' },
	];

	private destroy$ = new Subject<void>();

	ngOnInit(): void {
		this.form = this.dfs.createForm(TrlBrakesTemplate, this.vehicleTechRecord()) as CustomFormGroup;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe((event: any) => {
			if (event?.techRecord_axles) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				event.techRecord_axles = event.techRecord_axles.filter((axle: any) => !!axle?.axleNumber);
			}

			this.formChange.emit(event);
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		const { vehicleTechRecord } = changes;

		if (
			this.form &&
			vehicleTechRecord?.currentValue &&
			vehicleTechRecord.currentValue !== vehicleTechRecord.previousValue
		) {
			this.form.patchValue(vehicleTechRecord.currentValue, { emitEvent: false });
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get types(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get axles(): FormArray {
		return this.form.get(['techRecord_axles']) as FormArray;
	}

	getAxleForm(i: number): FormGroup {
		return this.form.get(['techRecord_axles', i]) as FormGroup;
	}

	getAxleBrakes(i: number): FormGroup {
		return this.form.get(['techRecord_axles', i, 'brakes']) as FormGroup;
	}

	stripName = (s: string): string => {
		const splitString = s.split('_').pop() ?? '';
		return (
			splitString.charAt(0).toUpperCase() +
			splitString
				.slice(1)
				.replace(/([A-Z])/g, ' $1')
				.toLowerCase()
		);
	};
}
