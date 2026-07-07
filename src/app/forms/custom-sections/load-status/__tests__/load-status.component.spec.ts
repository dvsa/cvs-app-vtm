import { State, initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
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

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('isLoadStatusApplicable', () => {
		it('should return true when the test type id is an annual/full prohibition test', () => {
			fixture.componentRef.setInput('data', {
				testTypes: [{ testTypeId: '94' }],
			});

			expect(component.isLoadStatusApplicable()).toBe(true);
		});

		it('should return false when the test type id is not an annual/full prohibition test or annual test result', () => {
			fixture.componentRef.setInput('data', {
				testTypes: [{ testTypeId: '41' }],
			});

			expect(component.isLoadStatusApplicable()).toBe(false);
		});

		it('should return false if conducting an annual test restest without defects failed on IM 59, 71, 72 or 73', () => {
			fixture.componentRef.setInput('data', {
				testTypes: [{ testTypeId: '53', testResult: 'fail', defects: [{ imNumber: 1 }] }],
			});

			expect(component.isLoadStatusApplicable()).toBe(false);
		});

		it('should return true if conducting an annual test restest which has failed on IM 59, 71, 72 or 73 and has defects', () => {
			fixture.componentRef.setInput('data', {
				testTypes: [{ testTypeId: '53', testResult: 'fail', defects: [{ imNumber: 59 }] }],
			});

			expect(component.isLoadStatusApplicable()).toBe(true);
		});
	});
});
