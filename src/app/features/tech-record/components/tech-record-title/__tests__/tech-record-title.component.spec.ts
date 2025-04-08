import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryTrl.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';

import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { Roles } from '@models/roles.enum';
import { V3TechRecordModel, VehicleTypes, VehiclesOtherThan } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';

import { State, initialAppState } from '@store/index';
import { editingTechRecord, selectTechRecord } from '@store/technical-records';
import { Observable, of } from 'rxjs';
import { TechRecordTitleComponent } from '../tech-record-title.component';

const MockUserService = {
	getUserName$: jest.fn().mockReturnValue(new Observable()),
	roles$: of([Roles.TestResultAmend, Roles.TestResultView]),
};

describe('TechRecordTitleComponent', () => {
	let component: TechRecordTitleComponent;
	let fixture: ComponentFixture<TechRecordTitleComponent>;
	let store: MockStore<State>;
	let technicalRecordService: TechnicalRecordService;
	let mockRecord: V3TechRecordModel;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TechRecordTitleComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{ provide: UserService, useValue: MockUserService },
				TechnicalRecordService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TechRecordTitleComponent);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		technicalRecordService = TestBed.inject(TechnicalRecordService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('the VRM fields', () => {
		beforeEach(() => {
			mockRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				primaryVrm: 'TESTVRM',
				secondaryVrms: ['TESTVRM1', 'TESTVRM2', 'TESTVRM3', 'TESTVRM4', 'TESTVRM5'],
				techRecord_vehicleType: VehicleTypes.LGV,
			} as unknown as TechRecordType<'put'>;
			jest.spyOn(store, 'select').mockReturnValue(of(mockRecord));
			fixture.componentRef.setInput('vehicle', mockRecord);
			store.overrideSelector(editingTechRecord, mockRecord);
		});
		it('should show primary VRM for current record', () => {
			fixture.detectChanges();

			const vrmField = fixture.nativeElement.querySelector('app-number-plate');
			expect(vrmField.textContent).toContain('TEST VRM');
		});

		it('should show the newest (last) secondary VRM', () => {
			fixture.detectChanges();

			const vrmField = fixture.nativeElement.querySelectorAll('app-number-plate')[1];
			expect(vrmField.textContent).toContain('TESTV RM5');
			expect(vrmField.textContent).not.toContain('TEST VRM');
			expect(vrmField.textContent).not.toContain('TESTV RM2');
			expect(vrmField.textContent).not.toContain('TESTV RM3');
			expect(vrmField.textContent).not.toContain('TESTV RM4');
		});
		it('should not create previous-vrm-span if no secondary vrm exists', () => {
			delete (mockRecord as VehiclesOtherThan<'trl'>).secondaryVrms;
			fixture.detectChanges();

			const vrmField = fixture.debugElement.query(By.css('#previous-vrm-span'));
			expect(vrmField).toBeNull();
		});
	});
	describe('trailer ID', () => {
		it('shows a trailer ID instead of VRM when vehicle type is a trailer', () => {
			const mockRecordTrailer = mockVehicleTechnicalRecord(VehicleTypes.TRL);
			jest.spyOn(technicalRecordService, 'techRecord$', 'get').mockReturnValue(of(mockRecordTrailer));

			fixture.componentRef.setInput('vehicle', mockRecordTrailer);

			store.overrideSelector(selectTechRecord, mockRecordTrailer);
			fixture.detectChanges();

			const trailerIdField = fixture.debugElement.query(By.css('#trailer-id'));
			expect(trailerIdField.nativeElement.textContent).toContain('TestId');
		});

		const smallTrailerEuVehicleCategories = [EUVehicleCategory.O1, EUVehicleCategory.O2];

		it.each(smallTrailerEuVehicleCategories)('does not show secondary VRMs for small trailer', (euVehicleCategory) => {
			const mockRecordTrailer = mockVehicleTechnicalRecord(VehicleTypes.TRL);
			jest.spyOn(technicalRecordService, 'techRecord$', 'get').mockReturnValue(of(mockRecordTrailer));
			mockRecordTrailer.techRecord_euVehicleCategory = euVehicleCategory;
			fixture.componentRef.setInput('vehicle', mockRecordTrailer);
			store.overrideSelector(selectTechRecord, mockRecordTrailer);
			fixture.detectChanges();

			const trailerIdField = fixture.debugElement.query(By.css('#trailer-id'));
			expect(trailerIdField.nativeElement.textContent).toContain('TestId');
			const secondaryVrmField = fixture.debugElement.query(By.css('#previous-vrm'));
			expect(secondaryVrmField).toBeNull();
		});
	});
});
