import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

import { Roles } from '@models/roles.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';

import { State, initialAppState } from '@store/index';
import { of } from 'rxjs';
import { LettersComponent } from '../letters.component';

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

describe('LettersComponent', () => {
	let component: LettersComponent;
	let fixture: ComponentFixture<LettersComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LettersComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore<State>({ initialState: initialAppState }),
				{
					provide: UserService,
					useValue: {
						roles$: of([Roles.TechRecordAmend]),
					},
				},
				{
					provide: ActivatedRoute,
					useValue: {
						useValue: { params: of([{ id: 1 }]) },
					},
				},
				{
					provide: APP_BASE_HREF,
					useValue: '/',
				},
				{
					provide: TechnicalRecordService,
					useValue: mockTechRecordService,
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LettersComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('techRecord', {
			systemNumber: 'foo',
			createdTimestamp: 'bar',
			vin: 'testVin',
			techRecord_statusCode: 'current',
		} as TechRecordType<'trl'>);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('eligibleForLetter', () => {
		it('should return true if the approval type is valid', () => {
			fixture.componentRef.setInput('techRecord', {
				techRecord_approvalType: ApprovalType.EU_WVTA_23_ON,
			} as TechRecordType<'trl'>);
			expect(component.eligibleForLetter).toBeTruthy();
		});

		it('should return false if the approval type is valid', () => {
			fixture.componentRef.setInput('techRecord', {
				techRecord_approvalType: ApprovalType.NTA,
			} as TechRecordType<'trl'>);
			expect(component.eligibleForLetter).toBeFalsy();
		});

		it('should return false if the statuscode is archived', () => {
			fixture.componentRef.setInput('techRecord', {
				techRecord_approvalType: ApprovalType.GB_WVTA,
				techRecord_statusCode: StatusCodes.ARCHIVED,
			} as TechRecordType<'trl'>);
			expect(component.eligibleForLetter).toBeFalsy();
		});
	});

	describe('checkRecordHistoryHasCurrent', () => {
		it('should return false if the current technical record history has current status', () => {
			expect(component.hasCurrent).toBeFalsy();
		});

		it('should return true if the provisional technical record history has current status', () => {
			fixture.componentRef.setInput('techRecord', {
				techRecord_statusCode: 'provisional',
			} as TechRecordType<'trl'>);
			component.ngOnInit();
			expect(component.hasCurrent).toBeTruthy();
		});
	});

	describe('letter', () => {
		it('should return the letter if it exists', () => {
			fixture.componentRef.setInput('techRecord', {
				techRecord_letterOfAuth_letterType: 'trailer acceptance',
				techRecord_letterOfAuth_paragraphId: 3,
				techRecord_letterOfAuth_letterIssuer: 'issuer',
			} as TechRecordType<'trl'>);
			expect(component.letter).toBeTruthy();
			expect(component.letter?.paragraphId).toBe(3);
			expect(component.letter?.letterIssuer).toBe('issuer');
		});

		it('should return undefined if it does not exist', () => {
			fixture.componentRef.setInput('techRecord', {
				techRecord_letterOfAuth_letterType: undefined,
			} as TechRecordType<'trl'>);

			expect(component.letter).toBeUndefined();
		});
	});
});
