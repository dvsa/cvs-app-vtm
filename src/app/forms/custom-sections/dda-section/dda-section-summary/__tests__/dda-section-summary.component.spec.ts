import { createMockPsv } from '@/src/mocks/psv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { editingTechRecord } from '@store/technical-records';
import { DDASectionSummaryComponent } from '../dda-section-summary.component';

describe('DDASectionSummaryComponent', () => {
	let component: DDASectionSummaryComponent;
	let fixture: ComponentFixture<DDASectionSummaryComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DDASectionSummaryComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(DDASectionSummaryComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('amendedTechRecord', () => {
		it('should expose the amended tech record from the store', () => {
			const mockTechRecord = createMockPsv(0) as TechRecordType<'psv'>;
			store.overrideSelector(editingTechRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			expect(component.amendedTechRecord()).toEqual(mockTechRecord);
		});

		it('should return undefined when there is no amended tech record', () => {
			store.overrideSelector(editingTechRecord, undefined as never);
			store.refreshState();
			fixture.detectChanges();

			expect(component.amendedTechRecord()).toBeUndefined();
		});
	});
});
