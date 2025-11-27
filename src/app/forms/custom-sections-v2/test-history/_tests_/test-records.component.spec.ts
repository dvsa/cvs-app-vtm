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
import { TestResultsComponent } from '@forms/custom-sections-v2/test-history/test-records.component';
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

describe('TestResultsComponent', () => {
	let component: TestResultsComponent;
	let fixture: ComponentFixture<TestResultsComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestResultsComponent],
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

		fixture = TestBed.createComponent(TestResultsComponent);
		fixture.componentRef.setInput('techRecord', mockTechRecord);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
