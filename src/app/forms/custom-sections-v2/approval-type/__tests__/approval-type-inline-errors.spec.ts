import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	ControlContainer,
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { ApprovalTypeComponent } from '@forms/custom-sections-v2/approval-type/approval-type.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

/**
 * Regression test for the approval type number inline error not appearing on submit. Selecting an
 * approval type makes the number required; pressing 'create new record' marks the form touched from
 * outside the template, which left ApprovalTypeNumber rendering stale markup with no error.
 */
describe('ApprovalTypeComponent approval type number inline error', () => {
	let fixture: ComponentFixture<ApprovalTypeComponent>;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'psv'>, FormControl>>>({});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, ApprovalTypeComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ApprovalTypeComponent);
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.componentRef.setInput('techRecord', {
			...mockVehicleTechnicalRecord('psv'),
			techRecord_approvalType: ApprovalType.NTA,
		} as V3TechRecordModel);
		fixture.detectChanges();
	});

	it('should show the inline error when an approval type is set but the number is missing', () => {
		const { form } = fixture.componentInstance;
		form.get('techRecord_approvalType')?.setValue(ApprovalType.NTA);
		form.get('techRecord_approvalTypeNumber')?.reset();
		fixture.detectChanges();

		// mirrors 'create new record'
		TestBed.inject(GlobalErrorService).markAllAsTouched(formGroupDirective.form);
		fixture.detectChanges();

		const messages = fixture.debugElement
			.queryAll(By.css('.govuk-error-message'))
			.map((element) => element.nativeElement.textContent.trim());

		expect(messages).toEqual(
			expect.arrayContaining([expect.stringContaining('Approval type number is required with Approval type')])
		);
	});
});
