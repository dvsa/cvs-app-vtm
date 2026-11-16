import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { createMockPsv } from '@/src/mocks/psv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { BodySectionViewComponent } from '../body-section-view.component';

describe('BodySectionViewComponent', () => {
	let component: BodySectionViewComponent;
	let fixture: ComponentFixture<BodySectionViewComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BodySectionViewComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(BodySectionViewComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('techRecord', () => {
		it('should expose the current tech record from the store', () => {
			const mockTechRecord = createMockHgv(0) as TechRecordType<'hgv'>;
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			expect(component.techRecord()).toEqual(mockTechRecord);
		});
	});

	describe('template rendering', () => {
		it('should render HGV/TRL body fields for an HGV vehicle', () => {
			const mockTechRecord = createMockHgv(0) as TechRecordType<'hgv'>;
			mockTechRecord.techRecord_make = 'Volvo';
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			const element = fixture.debugElement.query(By.css('#test-techRecord_make'));
			expect(element.nativeElement.textContent.trim()).toBe('Volvo');
		});

		it('should render PSV-only body fields for a PSV vehicle', () => {
			const mockTechRecord = createMockPsv(0) as TechRecordType<'psv'>;
			mockTechRecord.techRecord_chassisMake = 'Leyland';
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			const element = fixture.debugElement.query(By.css('#test-techRecord_chassisMake'));
			expect(element.nativeElement.textContent.trim()).toBe('Leyland');
			expect(fixture.debugElement.query(By.css('#test-techRecord_make'))).toBeFalsy();
		});

		it('should render nothing for a vehicle type without a body section', () => {
			const mockTechRecord = { ...createMockHgv(0), techRecord_vehicleType: VehicleTypes.CAR } as never;
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('dl.govuk-summary-list'))).toBeFalsy();
		});
	});
});
