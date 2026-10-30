import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { AdrSectionSummaryComponent } from '../adr-section-summary.component';

describe('AdrSectionSummaryComponent', () => {
	let component: AdrSectionSummaryComponent;
	let fixture: ComponentFixture<AdrSectionSummaryComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AdrSectionSummaryComponent],
			providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(AdrSectionSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('hasUNNumberChanged', () => {
		it('should return true when either the current or amended tech record is missing', () => {
			store.overrideSelector(techRecord, undefined as never);
			store.overrideSelector(editingTechRecord, undefined as never);
			store.refreshState();

			expect(component.hasUNNumberChanged(0)).toBe(true);
		});

		it('should return true when the UN number at the given index has changed', () => {
			const current = createMockHgv(0) as TechRecordType<'hgv'>;
			current.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = ['UN1', 'UN2'];
			const amended = createMockHgv(0) as TechRecordType<'hgv'>;
			amended.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = ['UN1', 'CHANGED'];

			store.overrideSelector(techRecord, current);
			store.overrideSelector(editingTechRecord, amended);
			store.refreshState();

			expect(component.hasUNNumberChanged(1)).toBe(true);
		});

		it('should return false when the UN number at the given index has not changed', () => {
			const current = createMockHgv(0) as TechRecordType<'hgv'>;
			current.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = ['UN1', 'UN2'];
			const amended = createMockHgv(0) as TechRecordType<'hgv'>;
			amended.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = ['UN1', 'UN2'];

			store.overrideSelector(techRecord, current);
			store.overrideSelector(editingTechRecord, amended);
			store.refreshState();

			expect(component.hasUNNumberChanged(1)).toBe(false);
		});

		it('should return false when neither record has UN numbers at the given index', () => {
			const current = createMockHgv(0) as TechRecordType<'hgv'>;
			current.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = undefined;
			const amended = createMockHgv(0) as TechRecordType<'hgv'>;
			amended.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = undefined;

			store.overrideSelector(techRecord, current);
			store.overrideSelector(editingTechRecord, amended);
			store.refreshState();

			expect(component.hasUNNumberChanged(0)).toBe(false);
		});
	});
});

