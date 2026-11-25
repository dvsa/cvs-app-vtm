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
import { editingTechRecord, techRecord } from '@store/technical-records';
import { BodySectionSummaryComponent } from '../body-section-summary.component';

describe('BodySectionSummaryComponent', () => {
	let component: BodySectionSummaryComponent;
	let fixture: ComponentFixture<BodySectionSummaryComponent>;
	let store: MockStore;

	const setRecords = (current: unknown, amended: unknown) => {
		store.overrideSelector(techRecord, current as never);
		store.overrideSelector(editingTechRecord, amended as never);
		store.refreshState();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BodySectionSummaryComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(BodySectionSummaryComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('amendedTechRecord', () => {
		it('should expose the amended tech record from the store', () => {
			const amended = createMockHgv(1) as TechRecordType<'hgv'>;
			setRecords(createMockHgv(0), amended);
			fixture.detectChanges();

			expect(component.amendedTechRecord()).toEqual(amended);
		});
	});

	describe('template rendering', () => {
		it('should only render body fields that have changed for an HGV vehicle', () => {
			const current = createMockHgv(0) as TechRecordType<'hgv'>;
			current.techRecord_make = 'Volvo';
			current.techRecord_model = 'FH';

			const amended = { ...current } as TechRecordType<'hgv'>;
			amended.techRecord_make = 'Scania';

			setRecords(current, amended);
			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('#test-techRecord_make'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_model'))).toBeFalsy();
		});

		it('should render PSV-only fields for a changed PSV vehicle', () => {
			const current = createMockPsv(0) as TechRecordType<'psv'>;
			current.techRecord_chassisMake = 'Leyland';

			const amended = { ...current } as TechRecordType<'psv'>;
			amended.techRecord_chassisMake = 'Dennis';

			setRecords(current, amended);
			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('#test-techRecord_chassisMake'))).toBeTruthy();
		});

		it('should render nothing for a vehicle type without a body section', () => {
			const record = { ...createMockHgv(0), techRecord_vehicleType: VehicleTypes.CAR } as never;
			setRecords(record, record);
			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('dl.govuk-summary-list'))).toBeFalsy();
		});
	});
});
