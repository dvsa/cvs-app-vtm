import { LoadingService } from '@/src/app/services/loading/loading.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { Observable, of, take } from 'rxjs';
import { loadingResolver } from '../loading.resolver';

const mockLoadingService = {
	showSpinner$: of(true),
};

describe('LoadingResolver', () => {
	let resolver: ResolveFn<boolean>;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{ provide: LoadingService, useValue: mockLoadingService },
			],
		});
		resolver = (...resolverParameters) => TestBed.runInInjectionContext(() => loadingResolver(...resolverParameters));
		store = TestBed.inject(MockStore);
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	it('should resolve to false when the spinner is still showing', (done) => {
		mockLoadingService.showSpinner$ = of(true);
		const result = TestBed.runInInjectionContext(() =>
			resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
		) as Observable<boolean>;

		result.pipe(take(1)).subscribe((value) => {
			expect(value).toBe(false);
			done();
		});
	});

	it('should resolve to true when the spinner has been dismissed', (done) => {
		mockLoadingService.showSpinner$ = of(false);
		const result = TestBed.runInInjectionContext(() =>
			resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
		) as Observable<boolean>;

		result.pipe(take(1)).subscribe((value) => {
			expect(value).toBe(true);
			done();
		});
	});
});
