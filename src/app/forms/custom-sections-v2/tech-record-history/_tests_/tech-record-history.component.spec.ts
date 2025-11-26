import { Roles } from '@/src/app/models/roles.enum';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { UserService } from '@/src/app/services/user-service/user-service';
import { initialAppState } from '@/src/app/store';
import { mockVehicleTechnicalRecord } from '@/src/mocks/mock-vehicle-technical-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { TechnicalRecordsHistoryComponent } from '@forms/custom-sections-v2/tech-record-history/tech-record-history.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

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

const mockTechRecord = { ...mockVehicleTechnicalRecord('trl'), trailerId: '123' } as TechRecordTypeVerb<'trl', 'get'>;

describe('TechnicalRecordsHistoryComponent', () => {
	let component: TechnicalRecordsHistoryComponent;
	let fixture: ComponentFixture<TechnicalRecordsHistoryComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TechnicalRecordsHistoryComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				{ provide: ControlContainer, useValue: { control: new FormGroup({}) } },

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
			],
		}).compileComponents();

		fixture = TestBed.createComponent(TechnicalRecordsHistoryComponent);
		fixture.componentRef.setInput('techRecord', mockTechRecord);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// describe('correctApprovalType', () => {
	//   it('should return true if the approval type is valid', () => {
	//     const techRecord = { ...mockTechRecord };
	//     techRecord.techRecord_approvalType = ApprovalType.EU_WVTA_23_ON;
	//     fixture.componentRef.setInput('techRecord', techRecord);
	//
	//     expect(component.correctApprovalType).toBeTruthy();
	//   });
	//
	//   it('should return false if the approval type is not valid', () => {
	//     const techRecord = { ...mockTechRecord };
	//     techRecord.techRecord_approvalType = ApprovalType.NTA;
	//     fixture.componentRef.setInput('techRecord', techRecord);
	//
	//     expect(component.correctApprovalType).toBeFalsy();
	//   });
	// });
	//
	// describe('letter', () => {
	//   it('should return the letter if it exists', () => {
	//     const techRecord = { ...mockTechRecord };
	//     techRecord.techRecord_letterOfAuth_letterType = 'trailer acceptance';
	//     techRecord.techRecord_letterOfAuth_paragraphId = 3;
	//     techRecord.techRecord_letterOfAuth_letterIssuer = 'issuer';
	//     fixture.componentRef.setInput('techRecord', techRecord);
	//
	//     expect(component.letter).toBeTruthy();
	//     expect(component.letter?.paragraphId).toBe(3);
	//     expect(component.letter?.letterIssuer).toBe('issuer');
	//   });
	//
	//   it('should return undefined if it does not exist', () => {
	//     const techRecord = { ...mockTechRecord };
	//     techRecord.techRecord_letterOfAuth_letterType = undefined;
	//     fixture.componentRef.setInput('techRecord', techRecord);
	//
	//     expect(component.letter).toBeUndefined();
	//   });
	// });
	//
	// describe('correctApprovalType', () => {
	//   it('should return true if the trailer has the correct approval type to generate letters', () => {
	//     const techRecord = { ...mockTechRecord };
	//     techRecord.techRecord_approvalType = ApprovalType.EU_WVTA_23_ON;
	//     fixture.componentRef.setInput('techRecord', techRecord);
	//
	//     expect(component.correctApprovalType).toBeTruthy();
	//   });
	//
	//   it('should return false if the trailer does not have an approval type to generate letters', () => {
	//     const techRecord = { ...mockTechRecord };
	//     techRecord.techRecord_approvalType = ApprovalType.IVA;
	//     fixture.componentRef.setInput('techRecord', techRecord);
	//
	//     expect(component.correctApprovalType).toBeFalsy();
	//   });
	// });
});
