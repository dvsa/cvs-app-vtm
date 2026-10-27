import { TestBed } from '@angular/core/testing';
import { Store, createSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';

describe('MockStore selector cleanup', () => {
	const state = { value: 'original' };
	const selectValue = createSelector(
		(state: { value: string }) => state.value,
		(value) => value
	);
	const selectDerivedValue = createSelector(selectValue, (value) => `derived ${value}`);

	afterEach(() => {
		selectValue.release();
		selectValue.clearResult();
	});

	it('should reset overrides when the test injector is destroyed', () => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: state })],
		});
		const store = TestBed.inject(MockStore);
		store.overrideSelector(selectValue, 'overridden');
		expect(selectValue(state)).toBe('overridden');
		expect(selectDerivedValue(state)).toBe('derived overridden');

		TestBed.resetTestingModule();

		expect(selectValue(state)).toBe('original');
		expect(selectDerivedValue({ ...state })).toBe('derived original');
	});

	it('should reset selectors configured by provideMockStore even when only Store is injected', async () => {
		TestBed.configureTestingModule({
			providers: [
				provideMockStore({
					initialState: state,
					selectors: [{ selector: selectValue, value: 'configured override' }],
				}),
			],
		});
		const store = TestBed.inject(Store);
		expect(await firstValueFrom(store.select(selectValue))).toBe('configured override');

		TestBed.resetTestingModule();
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: state })],
		});

		expect(await firstValueFrom(TestBed.inject(Store).select(selectValue))).toBe('original');
	});

	it('should allow test modules without a MockStore', () => {
		TestBed.configureTestingModule({});

		expect(TestBed.inject(MockStore, null)).toBeNull();
		expect(() => TestBed.resetTestingModule()).not.toThrow();
	});
});
