import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { BatchTechRecordDetailsSummaryCardComponent } from '../batch-tech-record-details-summary-card.component';

describe('BatchTechRecordDetailsSummaryCardComponent', () => {
	let fixture: ComponentFixture<BatchTechRecordDetailsSummaryCardComponent>;
	let component: BatchTechRecordDetailsSummaryCardComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BatchTechRecordDetailsSummaryCardComponent],
			providers: [provideMockStore({ initialState: initialAppState }), provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(BatchTechRecordDetailsSummaryCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(true).toBeTruthy();
	});
});
