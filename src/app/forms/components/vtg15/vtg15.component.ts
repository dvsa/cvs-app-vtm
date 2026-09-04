import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HazardClassification } from '@dvsa/cvs-type-definitions/types/enums/hazardClassification.enum.js';
import { MediaSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { getOptionsFromEnumWithCodeAndDescription } from '@forms/utils/enum-map';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { YES_NO_OPTIONS } from '@models/options.model';
import { Store } from '@ngrx/store';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { techRecord } from '@store/technical-records';
import { toEditOrNotToEdit } from '@store/test-records';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-vtg15',
	templateUrl: './vtg15.component.html',
	styleUrls: ['./vtg15.component.scss'],
	imports: [
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		RadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupSelectComponent,
	],
})
export class Vtg15Component implements OnInit, OnDestroy {
	store = inject(Store);
	fb = inject(FormBuilder);
	commonValidators = inject(CommonValidatorsService);
	cdr = inject(ChangeDetectorRef);

	form = this.fb.group({
		vtg15: this.fb.group({
			vtg15Required: this.fb.control<boolean | undefined>(undefined, [
				this.commonValidators.applyWhen(
					() => this.isVTGRequiredMandatory(),
					this.commonValidators.required(() => {
						return {
							error: 'Select if a VTG15 is required',
							anchorLink: 'vtg15Required',
						};
					})
				),
			]),
			primaryHazardClassification: this.fb.control<HazardClassification | undefined>(undefined, [
				this.commonValidators.applyWhen(
					() => this.vtgRequired(),
					this.commonValidators.required('Primary hazard classification')
				),
			]),
			secondaryHazardClassification: this.fb.control<HazardClassification | undefined>(undefined, []),
			unNumber: this.fb.control<number | undefined>(undefined, [
				this.commonValidators.applyWhen(() => this.vtgRequired(), this.commonValidators.required('UN number')),
			]),
			media: this.fb.control<MediaSchema[] | undefined>(undefined, []),
		}),
	});

	edit = input(false);
	amend = input(false);
	isContingencyTest = input(true);
	data = input<Partial<TestResultSchema>>({});
	formChange = output<Record<string, any> | [][]>();
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	currentTechRecord = this.store.selectSignal(techRecord);
	destroy = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.handleFormChange();
		this.initForm();
	}

	protected readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	protected readonly HAZARD_CLASSIFICATION_OPTIONS = getOptionsFromEnumWithCodeAndDescription(HazardClassification);
	protected readonly FORM_NODE_WIDTH = FormNodeWidth;

	initForm(): void {
		const testResult = this.testResult();

		if (testResult && testResult.vtg15 && testResult.vtg15.vtg15Required !== null) {
			const vtg15 = {
				...testResult.vtg15,
				primaryHazardClassification: this.toHazardClassificationOption(testResult.vtg15.primaryHazardClassification),
				secondaryHazardClassification: this.toHazardClassificationOption(
					testResult.vtg15.secondaryHazardClassification
				),
			};

			this.form.patchValue({ vtg15 });
			this.cdr.detectChanges();
		} else {
			const techRecord = this.currentTechRecord();
			if (
				(techRecord?.techRecord_vehicleType === 'hgv' ||
					techRecord?.techRecord_vehicleType === 'lgv' ||
					techRecord?.techRecord_vehicleType === 'trl') &&
				!this.amend()
			) {
				if (techRecord?.techRecord_adrDetails_dangerousGoods) {
					this.form.patchValue({
						vtg15: {
							vtg15Required: true,
						},
					});
					this.cdr.detectChanges();
				}
			}
		}
	}

	toHazardClassificationOption(value?: HazardClassification): HazardClassification | undefined {
		if (!value) return undefined;
		return Object.values(HazardClassification).find((option) => option.code === value.code) ?? value;
	}

	isVTGRequiredMandatory(): boolean {
		const techRecord = this.currentTechRecord();
		// not mandatory for amend mode
		if (this.amend()) {
			return false;
		}
		if (
			techRecord?.techRecord_vehicleType === 'hgv' ||
			techRecord?.techRecord_vehicleType === 'lgv' ||
			techRecord?.techRecord_vehicleType === 'trl'
		) {
			if (techRecord?.techRecord_adrDetails_dangerousGoods === true) {
				return true;
			}
		}
		return false;
	}

	vtgRequired(): boolean {
		return this.form.controls.vtg15.controls.vtg15Required.value ?? false;
	}

	handleFormChange(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
			this.formChange.emit(this.form.getRawValue());
		});
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}
}
