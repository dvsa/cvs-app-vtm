import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { ResultOfTestService } from '@/src/app/services/result-of-test/result-of-test.service';
import { testResultInEdit } from '@/src/app/store/test-records';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionControlComponent } from '@components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@components/accordion/accordion.component';
import { MediaSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-details';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { DefectsComponent } from '@features/test-records/custom-sections/defects/defects.component';
import { NotesComponent } from '@features/test-records/custom-sections/notes/notes.component';
import { ReasonForCreationComponent } from '@features/test-records/custom-sections/reason-for-creation/reason-for-creation.component';
import { TestComponent } from '@features/test-records/custom-sections/test/test.component';
import { VehicleComponent } from '@features/test-records/custom-sections/vehicle/vehicle.component';
import { VisitComponent } from '@features/test-records/custom-sections/visit/visit.component';
import { Modes } from '@models/modes.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { VehicleHeaderComponent } from '../../../../components/vehicle-header/vehicle-header.component';

@Component({
	selector: 'app-create-test-record-v2',
	templateUrl: './create-test-record-v2.component.html',
	styleUrls: ['./create-test-record-v2.component.scss'],
	imports: [
		ReasonForCreationComponent,
		FormsModule,
		ReactiveFormsModule,
		AccordionControlComponent,
		AccordionComponent,
		NgTemplateOutlet,
		DefectsComponent,
		NotesComponent,
		VisitComponent,
		VehicleComponent,
		TestComponent,
		ButtonGroupComponent,
		ButtonComponent,
		VehicleHeaderComponent,
	],
})
export class CreateTestRecordV2Component implements OnDestroy, OnInit {
	store = inject(Store);
	fb = inject(FormBuilder);
	testRecordService = inject(TestRecordsService);
	resultOfTestService = inject(ResultOfTestService);

	form = this.fb.group({});

	destroy$ = new ReplaySubject<boolean>(1);
	testResult = this.store.selectSignal(testResultInEdit);

	constructor() {
		effect(() => this.handleTestResultChange());
	}

	ngOnInit(): void {
		this.handleFormChanges();
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get testTypes(): FormArray | null {
		const testTypes = this.form.get('testTypes');
		return testTypes instanceof FormArray ? testTypes : null;
	}

	get testType(): FormGroup | null {
		const testType = this.testTypes?.at(0);
		return testType instanceof FormGroup ? testType : null;
	}

	get defects(): FormArray | null {
		const defects = this.testTypes?.at(0).get('defects');
		return defects instanceof FormArray ? defects : null;
	}

	handleFormChanges(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			this.testRecordService.updateEditingTestResult(this.form.getRawValue() as TestResultSchema);
		});
	}

	handleTestResultChange(): void {
		const testResult = this.testResult();
		if (!testResult) return;
		if (!testResult.testTypes[0]) return;
		console.log(testResult.testTypes[0]);

		// Resize form arrays
		this.resizeDefectsFormArray(testResult.testTypes[0].defects);

		// Patch form
		this.form.patchValue(testResult, { emitEvent: false, onlySelf: true });
	}

	resizeDefectsFormArray(defects: DefectDetailsSchema[]) {
		if (!Array.isArray(defects)) return;

		const formArray = this.fb.array([
			defects.map(() =>
				this.fb.group({
					deficiencyRef: this.fb.control('', []),
					imNumber: this.fb.control<number | null>(null, []),
					imDescription: this.fb.control('', []),
					itemNumber: this.fb.control<number | null>(null, []),
					itemDescription: this.fb.control('', []),
					deficiencyId: this.fb.control('', []),
					deficiencySubId: this.fb.control('', []),
					deficiencyText: this.fb.control('', []),
					additionalInformation: this.fb.group({
						location: this.fb.group({
							vertical: this.fb.control('', []),
							horizontal: this.fb.control('', []),
							lateral: this.fb.control('', []),
							longitudinal: this.fb.control('', []),
							rowNumber: this.fb.control<number | null>(null, []),
							seatNumber: this.fb.control<number | null>(null, []),
							axleNumber: this.fb.control<number | null>(null, []),
						}),
						notes: this.fb.control('', []),
					}),
					prs: this.fb.control<boolean | null>(null, []),
					prohibitionIssued: this.fb.control<boolean | null>(null, []),
					stdForProhibition: this.fb.control<boolean | null>(null, []),
					media: this.fb.control<MediaSchema[]>([], []),
				})
			),
		]);

		formArray.patchValue(defects);

		this.testType?.setControl('defects', formArray);
	}

	onReview(): void {
		this.form.markAllAsTouched();
		console.log(this.form.value);
	}

	onMarkAsAbandoned(): void {
		this.form.markAllAsTouched();
	}

	protected readonly Modes = Modes;
	protected readonly VehicleTypes = VehicleTypes;
}
