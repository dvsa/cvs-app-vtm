import { Component, OnDestroy, OnInit, forwardRef, input } from '@angular/core';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseTestRecordV2Component } from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-required-hidden',
	templateUrl: './required-hidden.component.html',
	imports: [FormsModule, ReactiveFormsModule],
	styleUrls: ['./required-hidden.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => RequiredHiddenComponent),
			multi: true,
		},
	],
})
export class RequiredHiddenComponent extends BaseTestRecordV2Component implements OnInit, OnDestroy {
	destroy$ = new ReplaySubject<boolean>(1);
	mode = input.required<Modes>();
	vehicleType = input.required<VehicleTypes>();

	testResult$ = this.testRecordService.editingTestResult$;

	form!: FormGroup;

	ngOnInit(): void {
		this.form = this.HGVTRLForm;
		this.init(this.form);

		// Prepopulate form with current test record
		this.form.patchValue(this.testResult$ as any);
	}

	ngOnDestroy() {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get HGVTRLForm() {
		return new FormGroup({
			testResultId: this.fb.control('', []),
			vehicleType: this.fb.control('', []),
			contingencyTestNumber: this.fb.control('', []),
			typeOfTest: this.fb.control('', []),
			source: this.fb.control('', []),
			testStatus: this.fb.control('', []),
			systemNumber: this.fb.control('', []),
			testerStaffId: this.fb.control('', []),
			testEndTimestamp: this.fb.control('', []),
			vehicleClass: this.fb.group({
				code: this.fb.control('', []),
				description: this.fb.control('', []),
			}),
			noOfAxles: this.fb.control('', []),
			numberOfWheelsDriven: this.fb.control('', []),
			regnDate: this.fb.control('', []),
			firstUseDate: this.fb.control('', []),
			createdByName: this.fb.control('', []),
			createdById: this.fb.control('', []),
			lastUpdatedAt: this.fb.control('', []),
			lastUpdatedByName: this.fb.control('', []),
			lastUpdatedById: this.fb.control('', []),
			shouldEmailCertificate: this.fb.control('', []),
			vehicleConfiguration: this.fb.control('', []),
			reasonForCancellation: this.fb.control('', []),
			testTypes: this.fb.array([
				this.fb.group({
					testTypeId: this.fb.control('', []),
					name: this.fb.control('', []),
					secondaryCertificateNumber: this.fb.control('', []),
					createdAt: this.fb.control('', []),
					lastUpdatedAt: this.fb.control('', []),
					certificateLink: this.fb.control('', []),
					testTypeClassification: this.fb.control('', []),
					deletionFlag: this.fb.control('', []),
				}),
			]),
		});
	}
}
