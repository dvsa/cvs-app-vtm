import { initialAppState } from '@/src/app/store';
import { selectBatchSuccess, selectBatchSuccessCount } from '@/src/app/store/batch/batch.selectors';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BatchSummaryComponent } from '../batch-summary.component';

describe('BatchSummaryComponent', () => {
	let component: BatchSummaryComponent;
	let fixture: ComponentFixture<BatchSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BatchSummaryComponent],
			providers: [provideRouter([]), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		fixture = TestBed.createComponent(BatchSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('links successful records by system number without pinning their version', () => {
		const store = TestBed.inject(MockStore);
		store.overrideSelector(selectBatchSuccess, [
			{ id: 1, vin: 'VIN123', systemNumber: '123', createdTimestamp: '2024-01-01', created: true },
		]);
		store.overrideSelector(selectBatchSuccessCount, 1);
		store.refreshState();
		fixture.detectChanges();

		const link: HTMLAnchorElement = fixture.nativeElement.querySelector('#vehicle-0-view-link');
		expect(link.getAttribute('href')).toBe('/tech-records/123');
		expect(link.target).toBe('_blank');
	});
});
