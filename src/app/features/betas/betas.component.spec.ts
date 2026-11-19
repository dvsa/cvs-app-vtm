import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngrx/store';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { fetchFeatureFlagsSuccess } from '@store/feature-flags/feature-flags.actions';
import { FeatureConfig, FeatureFlags } from '@store/feature-flags/feature-flags.feature';
import { featureFlagsReducer } from '@store/feature-flags/feature-flags.reducer';
import { selectFeatureFlags } from '@store/feature-flags/feature-flags.selectors';
import { firstValueFrom } from 'rxjs';
import { BetasComponent } from './betas.component';

describe('BetasComponent', () => {
	let fixture: ComponentFixture<BetasComponent>;
	let store: Store;

	const config = {
		[FeatureFlags.BATCH_REDESIGN]: { enabled: true, _variant: 'default' },
		[FeatureFlags.TEST_FACILITY]: { enabled: true, activities: ['read:ddb'] },
		[FeatureFlags.TEST_RESULT_CREATE]: { enabled: true },
		[FeatureFlags.TEST_RESULT_AMEND]: { enabled: true },
		[FeatureFlags.TEST_RESULT_REFACTOR]: {
			enabled: true,
			testTypesDeskBasedGroup1: false,
			testTypesDeskBasedGroup2: false,
			testTypesDeskBasedGroup3: false,
			testTypesDeskBasedGroup4: false,
			testTypesDeskBasedGroup5: false,
			testTypesGroup1: true,
			testTypesGroup12And14: true,
			testTypesGroup15And16: false,
			testTypesGroup2: true,
			testTypesGroup3And4And8: false,
			testTypesGroup5And13: true,
			testTypesGroup6And11: false,
			testTypesGroup7: true,
			testTypesGroup8Notifiable: false,
			testTypesGroup9And10: true,
			testTypesGroup9And10CentralDocs: true,
			testTypesSpecialistGroup1: true,
			testTypesSpecialistGroup1OldIVAorMSVA: false,
			testTypesSpecialistGroup2: false,
			testTypesSpecialistGroup3: false,
			testTypesSpecialistGroup4: false,
			testTypesSpecialistGroup5: false,
			testTypesSpecialistGroup5OldIVAorMSVA: false,
		},
	} satisfies FeatureConfig;

	const checkbox = (id: string): HTMLInputElement | null =>
		fixture.nativeElement.querySelector(`input[id="${id}-checkbox"]`);

	const clickLabel = (id: string): void => {
		const label: HTMLLabelElement = fixture.nativeElement.querySelector(`label[for="${id}-checkbox"]`);
		expect(label).toBeTruthy();
		label.click();
		fixture.detectChanges();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BetasComponent],
			providers: [provideRouter([]), provideStore({ featureFlags: featureFlagsReducer })],
		}).compileComponents();
		store = TestBed.inject(Store);
		store.dispatch(fetchFeatureFlagsSuccess({ config }));
		vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
		fixture = TestBed.createComponent(BetasComponent);
		fixture.detectChanges();
		await fixture.whenStable();
	});

	it('shows labelled controls for boolean properties, but not other flag properties or blocked flags', () => {
		expect(checkbox('test-result-refactor')?.checked).toBe(true);
		expect(checkbox('test-result-refactor-testTypesGroup1')?.checked).toBe(true);
		expect(checkbox('test-result-refactor-testTypesGroup15And16')?.checked).toBe(false);
		expect(fixture.nativeElement.textContent).toContain('testTypesGroup1');
		expect(checkbox('batch-redesign-_variant')).toBeNull();
		expect(checkbox('test-facility')).toBeNull();
		expect(checkbox('testresultcreate')).toBeNull();
		expect(checkbox('testresultamend')).toBeNull();
	});

	it('hides nested controls while disabled and restores their edited values when re-enabled', () => {
		clickLabel('test-result-refactor-testTypesGroup1');
		expect(checkbox('test-result-refactor-testTypesGroup1')?.checked).toBe(false);

		clickLabel('test-result-refactor');
		expect(checkbox('test-result-refactor-testTypesGroup1')).toBeNull();

		clickLabel('test-result-refactor');
		expect(checkbox('test-result-refactor-testTypesGroup1')?.checked).toBe(false);
	});

	it('shows the saved nested values when an initially disabled flag is enabled', async () => {
		fixture.destroy();
		store.dispatch(
			fetchFeatureFlagsSuccess({
				config: {
					...config,
					[FeatureFlags.TEST_RESULT_REFACTOR]: { ...config[FeatureFlags.TEST_RESULT_REFACTOR], enabled: false },
				},
			})
		);
		fixture = TestBed.createComponent(BetasComponent);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(checkbox('test-result-refactor-testTypesGroup1')).toBeNull();
		clickLabel('test-result-refactor');
		await fixture.whenStable();
		fixture.detectChanges();
		expect(checkbox('test-result-refactor-testTypesGroup1')?.checked).toBe(true);
	});

	it('saves boolean overrides locally without discarding other properties, including while hidden', async () => {
		clickLabel('test-result-refactor-testTypesGroup1');
		clickLabel('test-result-refactor-testTypesGroup15And16');
		clickLabel('test-result-refactor');

		expect(await firstValueFrom(store.select(selectFeatureFlags))).toEqual(config);

		fixture.componentInstance.save();
		const saved = await firstValueFrom(store.select(selectFeatureFlags));
		expect(saved?.[FeatureFlags.TEST_RESULT_REFACTOR]).toEqual({
			...config[FeatureFlags.TEST_RESULT_REFACTOR],
			enabled: false,
			testTypesGroup1: false,
			testTypesGroup15And16: true,
		});
		expect(saved?.[FeatureFlags.BATCH_REDESIGN]).toEqual(config[FeatureFlags.BATCH_REDESIGN]);
		expect(saved?.[FeatureFlags.TEST_FACILITY]).toEqual(config[FeatureFlags.TEST_FACILITY]);
	});

	it('applies saved group overrides to test-result routing', () => {
		const featureToggleService = TestBed.inject(FeatureToggleService);
		expect(featureToggleService.shouldUseV2TestResults('1')).toBe(true);
		expect(featureToggleService.shouldUseV2TestResults('39')).toBe(false);

		clickLabel('test-result-refactor-testTypesGroup1');
		clickLabel('test-result-refactor-testTypesGroup15And16');
		fixture.componentInstance.save();

		expect(featureToggleService.shouldUseV2TestResults('1')).toBe(false);
		expect(featureToggleService.shouldUseV2TestResults('39')).toBe(true);
	});
});
