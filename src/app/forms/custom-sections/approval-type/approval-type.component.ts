import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApprovalType as approvalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { ApprovalType as approvalTypeHgvOrPsv } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalTypeHgvOrPsv.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { HgvAndTrlTypeApprovalTemplate } from '@forms/templates/general/approval-type.template';
import { PsvTypeApprovalTemplate } from '@forms/templates/psv/psv-approval-type.template';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechRecord } from '@models/vehicle/techRecord';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormGroup,
	FormNode,
	FormNodeEditTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { SwitchableInputComponent } from '../../components/switchable-input/switchable-input.component';

@Component({
	selector: 'app-approval-type[techRecord]',
	templateUrl: './approval-type.component.html',
	styleUrls: ['./approval-type.component.scss'],
	imports: [SwitchableInputComponent],
})
export class ApprovalTypeComponent implements OnInit, OnChanges, OnDestroy {
	dfs = inject(DynamicFormService);

	readonly techRecord = input.required<TechRecordType<'hgv' | 'psv' | 'trl'>>();
	readonly isEditing = input(false);
	readonly formChange = output<Record<string, any> | [][]>();
	readonly approvalTypeNumberChange = output<string>();

	public form!: CustomFormGroup;
	private destroy$ = new Subject<void>();
	protected chosenApprovalType: string | undefined;
	protected approvalTypeChange = false;
	protected approvalType: typeof approvalTypeHgvOrPsv | typeof approvalType = approvalType;
	formControls: { [key: string]: FormControl } = {};

	ngOnInit() {
		const techRecord = this.techRecord();
		this.approvalType =
			techRecord.techRecord_vehicleType === 'psv' || techRecord.techRecord_vehicleType === 'hgv'
				? approvalTypeHgvOrPsv
				: approvalType;
		this.form = this.dfs.createForm(
			this.techRecord().techRecord_vehicleType === 'psv' ? PsvTypeApprovalTemplate : HgvAndTrlTypeApprovalTemplate,
			this.techRecord()
		) as CustomFormGroup;
		this.form.cleanValueChanges
			.pipe(debounceTime(400), takeUntil(this.destroy$))
			.subscribe((e) => this.formChange.emit(e));
		Object.keys(this.form.controls).forEach((key) => {
			this.formControls[`${key}`] = this.form.get(key) as FormControl;
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		const { techRecord } = changes;
		if (this.form && techRecord?.currentValue && techRecord.currentValue !== techRecord.previousValue) {
			const { currentValue } = techRecord;

			this.form.patchValue(currentValue, { emitEvent: false });
			this.chosenApprovalType = currentValue.techRecord_approvalType ? currentValue.techRecord_approvalType : '';
			techRecord.currentValue.techRecord_coifDate = currentValue.techRecord_coifDate
				? currentValue.techRecord_coifDate.split('T')[0]
				: '';
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get template(): FormNode {
		switch (this.techRecord().techRecord_vehicleType) {
			case VehicleTypes.PSV:
				return PsvTypeApprovalTemplate;
			case VehicleTypes.HGV:
				return HgvAndTrlTypeApprovalTemplate;
			case VehicleTypes.TRL:
				return HgvAndTrlTypeApprovalTemplate;
			default:
				throw Error('Incorrect vehicle type!');
		}
	}

	get editTypes(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get widths(): typeof FormNodeWidth {
		return FormNodeWidth;
	}

	get isPsv(): boolean {
		return this.techRecord().techRecord_vehicleType === VehicleTypes.PSV;
	}

	get formNodeViewTypes(): typeof FormNodeViewTypes {
		return FormNodeViewTypes;
	}
	protected readonly TechRecord = TechRecord;
	protected readonly getOptionsFromEnum = getOptionsFromEnum;
}
