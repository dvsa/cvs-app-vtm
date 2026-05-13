import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { TestService } from '@/src/app/services/test/test.service';
import { testResultInEdit } from '@/src/app/store/test-records';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
	testService = inject(TestService);
	testRecordService = inject(TestRecordsService);

	form = this.testService.form;

	destroy$ = new ReplaySubject<boolean>(1);
	testResult = this.store.selectSignal(testResultInEdit);

	private handleFormChanges(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			this.testRecordService.updateEditingTestResult(this.form.getRawValue() as TestResultSchema);
		});
	}

	ngOnInit(): void {
		this.handleFormChanges();
	}

	ngOnDestroy(): void {
		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	onReview(): void {
		this.form.markAllAsTouched();
	}

	onMarkAsAbandoned(): void {
		this.form.markAllAsTouched();
	}

	protected readonly Modes = Modes;
	protected readonly VehicleTypes = VehicleTypes;
}
