import { State, initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectAllTestResults } from '@store/test-records';
import { LoadStatusComponent } from '../load-status.component';

describe('LoadStatusComponent', () => {
	let component: LoadStatusComponent;
	let fixture: ComponentFixture<LoadStatusComponent>;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LoadStatusComponent],
			providers: [provideRouter([]), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(LoadStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		store.resetSelectors();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('isLoadStatusApplicable', () => {
		// The annual test being retested
		const setTestHistory = (testType: Record<string, unknown>) => {
			store.overrideSelector(selectAllTestResults, [
				{
					testStatus: TestStatus.SUBMITTED,
					testTypes: [{ testTypeStartTimestamp: '2026-09-23T09:00:00.000Z', ...testType }],
				} as TestResultSchema,
			]);
			store.refreshState();
		};

		const setRetest = () => {
			fixture.componentRef.setInput('data', {
				vehicleType: 'hgv',
				testTypes: [{ testTypeId: '53', testTypeStartTimestamp: '2026-09-28T10:00:00.000Z' }],
			});
		};

		it('should return true when the test type id is an annual/full prohibition test', () => {
			fixture.componentRef.setInput('data', {
				testTypes: [{ testTypeId: '94' }],
			});

			expect(component.isLoadStatusApplicable()).toBe(true);
		});

		it('should return false when the test type id is not an annual/full prohibition test or annual test retest', () => {
			fixture.componentRef.setInput('data', {
				testTypes: [{ testTypeId: '41' }],
			});

			expect(component.isLoadStatusApplicable()).toBe(false);
		});

		it('should return false when conducting an annual test retest and the vehicle has no test history', () => {
			setRetest();

			expect(component.isLoadStatusApplicable()).toBe(false);
		});

		it('should return false when the annual test being retested was not failed on IM 59, 71, 72 or 73', () => {
			setRetest();
			setTestHistory({ testTypeId: '94', testResult: TestResults.FAIL, defects: [{ imNumber: 1 }] });

			expect(component.isLoadStatusApplicable()).toBe(false);
		});

		it('should return true when the annual test being retested was failed on IM 59, 71, 72 or 73', () => {
			setRetest();
			setTestHistory({ testTypeId: '94', testResult: TestResults.FAIL, defects: [{ imNumber: 59 }] });

			expect(component.isLoadStatusApplicable()).toBe(true);
		});

		it('should return false when the annual test being retested was failed outside of the retest window', () => {
			setRetest();
			setTestHistory({
				testTypeId: '94',
				testResult: TestResults.FAIL,
				testTypeStartTimestamp: '2026-09-06T09:00:00.000Z',
				defects: [{ imNumber: 59 }],
			});

			expect(component.isLoadStatusApplicable()).toBe(false);
		});
	});
});
