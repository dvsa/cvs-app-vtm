import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { ReasonForCreationComponent } from '@features/test-records/custom-sections/reason-for-creation/reason-for-creation.component';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-create-test-record-v2',
	templateUrl: './create-test-record-v2.component.html',
	styleUrls: ['./create-test-record-v2.component.scss'],
	imports: [ReasonForCreationComponent, FormsModule, ReactiveFormsModule],
})
export class CreateTestRecordV2Component implements OnDestroy, OnInit {
	store = inject(Store);
	form = new FormGroup({});
	testRecordService = inject(TestRecordsService);
	destroy$ = new ReplaySubject<boolean>(1);

	private handleFormChanges(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			this.testRecordService.updateEditingTestResult(this.form.getRawValue() as TestResultSchema);
		});
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

	protected readonly Modes = Modes;
}
