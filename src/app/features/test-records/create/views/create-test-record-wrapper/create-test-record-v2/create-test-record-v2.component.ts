import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { techRecord } from '@/src/app/store/technical-records';
import { cleanTestResultPayload, createTestResult, testResultInEdit } from '@/src/app/store/test-records';
import { selectTestType } from '@/src/app/store/test-types/test-types.selectors';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal, computed, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionControlComponent } from '@components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@components/accordion/accordion.component';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
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
	router = inject(Router);
	route = inject(ActivatedRoute);
	testService = inject(TestService);
	testRecordService = inject(TestRecordsService);
	techRecordSerivce = inject(TechnicalRecordService);
	globalErrorService = inject(GlobalErrorService);

	form = this.testService.form;

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = this.store.selectSignal(techRecord);
	testResult = this.store.selectSignal(testResultInEdit);
	testTypeId = this.store.selectSignal(selectQueryParam('testType')) as Signal<string>;
	testType = computed(() => this.store.selectSignal(selectTestType(this.testTypeId()))());

	private handleFormChanges(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			this.testRecordService.updateEditingTestResult(this.form.getRawValue() as TestResultSchema);
		});
	}

	private handleMissingTestResult(): void {
		this.testRecordService.editingTestResult$.pipe(takeUntil(this.destroy$)).subscribe((testResult) => {
			if (!testResult) {
				this.router.navigate(['../../..'], { relativeTo: this.route.parent });
			}
		});
	}

	ngOnInit(): void {
		this.prepopulateForm();
		this.handleFormChanges();
		this.handleMissingTestResult();
	}

	ngOnDestroy(): void {
		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	prepopulateForm(): void {
		const testResult = this.testResult();
		if (!testResult) return;

		this.form.patchValue(testResult as any);

		this.form.controls.testTypes.at(0).patchValue({
			testTypeId: this.testType()?.id,
			testTypeName: this.testType()?.name,
			name: this.testType()?.name,
		});
	}

	onReview(): void {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			const errors = this.globalErrorService.extractGlobalErrors(this.form);
			this.globalErrorService.setErrors(errors);
			return;
		}

		// @TODO: move this to review page

		// Spread to remove undefined keys
		const raw = { ...this.form.getRawValue() } as TestResultSchema;
		const value = cleanTestResultPayload(raw);
		if (!value) return;

		this.store.dispatch(createTestResult({ value }));
	}

	onMarkAsAbandoned(): void {
		this.form.markAllAsTouched();
	}

	protected readonly Modes = Modes;
	protected readonly VehicleTypes = VehicleTypes;
}
