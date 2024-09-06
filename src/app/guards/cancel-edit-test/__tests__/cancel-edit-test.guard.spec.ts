import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CancelEditTestGuard } from '../cancel-edit-test.guard';

describe('NoEditGuard', () => {
	let guard: CancelEditTestGuard;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				CancelEditTestGuard,
				provideMockStore({}),
				{ provide: RouterStateSnapshot, useValue: jest.fn().mockReturnValue({ url: '', toString: jest.fn() }) },
			],
		});

		guard = TestBed.inject(CancelEditTestGuard);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	it('should return true', () => {
		expect(guard.canDeactivate()).toBeTruthy();
	});
});
