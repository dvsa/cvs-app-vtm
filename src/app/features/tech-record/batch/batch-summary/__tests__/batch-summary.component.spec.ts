import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
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
});
