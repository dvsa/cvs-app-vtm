import { createMockPsv } from '@/src/mocks/psv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { DDASectionViewComponent } from '../dda-section-view.component';

describe('DDASectionViewComponent', () => {
	let component: DDASectionViewComponent;
	let fixture: ComponentFixture<DDASectionViewComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DDASectionViewComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(DDASectionViewComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('techRecord', () => {
		it('should expose the current tech record from the store', () => {
			const mockTechRecord = createMockPsv(0) as TechRecordType<'psv'>;
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			expect(component.techRecord()).toEqual(mockTechRecord);
		});

		it('should return undefined when there is no tech record in the store', () => {
			store.overrideSelector(techRecord, undefined as never);
			store.refreshState();
			fixture.detectChanges();

			expect(component.techRecord()).toBeUndefined();
		});
	});
});
