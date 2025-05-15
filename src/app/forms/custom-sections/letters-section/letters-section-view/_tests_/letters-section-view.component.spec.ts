import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectorRef, ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	ControlContainer,
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { LettersSectionViewComponent } from '@forms/custom-sections/letters-section/letters-section-view/letters-section-view.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { Roles } from '@models/roles.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';

const mockTechRecordService = {
	techRecordHistory$: of([
		{
			vin: 'test',
			techRecord_statusCode: 'current',
			techRecord_vehicleType: 'trl',
			createdTimestamp: '12345',
			systemNumber: '123',
			techRecord_manufactureYear: 2021,
		},
	] as TechRecordSearchSchema[]),
};

describe('LettersSectionViewComponent', () => {
	let component: LettersSectionViewComponent;
	let componentRef: ComponentRef<LettersSectionViewComponent>;
	let fixture: ComponentFixture<LettersSectionViewComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;

	const actions$ = new ReplaySubject<Action>();
	const mockTechRecord = { ...mockVehicleTechnicalRecord('trl'), trailerId: '123' } as TechRecordTypeVerb<'trl', 'get'>;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<
			Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'psv' | 'lgv' | 'trl'>, FormControl>>
		>({});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, LettersSectionViewComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				{
					provide: TechnicalRecordService,
					useValue: mockTechRecordService,
				},
				{
					provide: UserService,
					useValue: {
						roles$: of([Roles.TechRecordAmend]),
					},
				},
				ChangeDetectorRef,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(LettersSectionViewComponent);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		store.overrideSelector(techRecord, mockTechRecord);
		store.refreshState();
		fixture.detectChanges();
	});

	it('should create the letters section view component', () => {
		expect(component).toBeTruthy();
	});

	describe('eligibleForLetter', () => {
		beforeEach(() => {
			jest.spyOn(component, 'correctApprovalType', 'get').mockReturnValue(true);
			component.hasCurrent = false;
		});

		it('should return true if trailer has valid approval type, and is not archived', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_approvalType: ApprovalType.EU_WVTA_23_ON,
				techRecord_statusCode: StatusCodes.CURRENT,
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.eligibleForLetter).toBeTruthy();
		});

		it('should return false if the approval type is not valid', () => {
			jest.spyOn(component, 'correctApprovalType', 'get').mockReturnValue(false);
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_approvalType: ApprovalType.NTA,
				techRecord_statusCode: StatusCodes.CURRENT,
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.eligibleForLetter).toBeFalsy();
		});

		it('should return false if the statusCode is archived', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_approvalType: ApprovalType.GB_WVTA,
				techRecord_statusCode: StatusCodes.ARCHIVED,
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.eligibleForLetter).toBeFalsy();
		});
	});

	describe('correctApprovalType', () => {
		it('should return true if the approval type is valid', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_approvalType: ApprovalType.EU_WVTA_23_ON,
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.correctApprovalType).toBeTruthy();
		});

		it('should return false if the approval type is not valid', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_approvalType: ApprovalType.NTA,
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.correctApprovalType).toBeFalsy();
		});
	});

	describe('checkRecordHistoryHasCurrent', () => {
		beforeEach(() => {
			component.hasCurrent = false;
		});
		it('should return false if the current technical record history has current status', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_statusCode: 'current',
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			component.checkForCurrentRecordInHistory();
			// component.ngOnInit();
			expect(component.hasCurrent).toBeFalsy();
		});

		it('should return true if the provisional technical record history has current status', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_statusCode: 'provisional',
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			component.checkForCurrentRecordInHistory();
			// component.ngOnInit();
			expect(component.hasCurrent).toBeTruthy();
		});
	});

	describe('letter', () => {
		it('should return the letter if it exists', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_letterOfAuth_letterType: 'trailer acceptance',
				techRecord_letterOfAuth_paragraphId: 3,
				techRecord_letterOfAuth_letterIssuer: 'issuer',
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.letter).toBeTruthy();
			expect(component.letter?.paragraphId).toBe(3);
			expect(component.letter?.letterIssuer).toBe('issuer');
		});

		it('should return undefined if it does not exist', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_letterOfAuth_letterType: undefined,
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.letter).toBeUndefined();
		});
	});

	describe('correctApprovalType', () => {
		it('should return true if the trailer has the correct approval type to generate letters', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_approvalType: ApprovalType.EU_WVTA_23_ON,
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.correctApprovalType).toBeTruthy();
		});

		it('should return false if the trailer does not have an approval type to generate letters', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_approvalType: 'IVA',
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.correctApprovalType).toBeFalsy();
		});
	});

	describe('reasonForIneligibility', () => {
		it('should return correct string for when a vehicle has both a current and provisional tech record', () => {
			component.hasCurrent = true;
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_statusCode: 'provisional',
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.reasonForIneligibility).toBe(
				'Generating letters is not applicable to provisional records, where a current record also exists for a vehicle. ' +
					'Open the current record to generate letters.'
			);
		});

		it('should return correct string for when a vehicle has both an archived tech record', () => {
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_statusCode: 'archived',
			} as TechRecordTypeVerb<'trl', 'get'>);
			store.refreshState();

			expect(component.reasonForIneligibility).toBe(
				'Generating letters is not applicable to archived technical records.'
			);
		});

		it('should return correct string for when a vehicle has both an archived tech record', () => {
			jest.spyOn(component, 'correctApprovalType', 'get').mockReturnValue(false);
			component.hasCurrent = false;
			store.overrideSelector(techRecord, {
				...mockTechRecord,
				techRecord_statusCode: 'current',
			} as TechRecordTypeVerb<'trl', 'get'>);
			fixture.detectChanges();

			expect(component.reasonForIneligibility).toBe(
				'This trailer does not have the right approval type to be eligible for a letter of authorisation.'
			);
		});
	});
});
