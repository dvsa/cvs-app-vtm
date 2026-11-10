import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { deficiencyCategory } from '@/src/app/models/defects/deficiency-category.enum';
import { DefectMediaService } from '@/src/app/services/defect-media-service/defect-media-service.service';
import { TestService } from '@/src/app/services/test/test.service';
import { defects } from '@/src/app/store/defects';
import { initialAppState } from '@/src/app/store/index';
import { selectRouteParams } from '@/src/app/store/router/router.selectors';
import {
	createDefect,
	removeDefect,
	toEditOrNotToEdit,
	updateDefect,
	updateResultOfTest,
} from '@/src/app/store/test-records';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DefectV2Component } from '../defect-v2.component';

describe('DefectV2Component', () => {
	let component: DefectV2Component;
	let fixture: ComponentFixture<DefectV2Component>;
	let store: MockStore;
	let testService: TestService;
	let router: Router;
	const globalErrors = { extractGlobalErrors: vi.fn(), setErrors: vi.fn() };

	const taxonomy = {
		imNumber: 1,
		imDescription: 'Brakes',
		forVehicleType: ['hgv'],
		additionalInfo: { hgv: { location: { vertical: ['upper', 'lower'], axleNumber: [1, 2] } } },
		items: [
			{
				itemNumber: 2,
				itemDescription: 'Brake condition:',
				forVehicleType: ['hgv'],
				deficiencies: [
					{
						ref: '1.2.a',
						deficiencyId: 'a',
						deficiencySubId: 'i',
						deficiencyText: 'Brake inoperative',
						deficiencyCategory: deficiencyCategory.Dangerous,
						stdForProhibition: false,
						forVehicleType: ['hgv'],
					},
				],
			},
		],
	} as DefectCategoryReferenceDataSchema;

	beforeEach(() => {
		globalErrors.extractGlobalErrors.mockReset();
		globalErrors.setErrors.mockReset();
		TestBed.configureTestingModule({
			imports: [DefectV2Component],
			providers: [
				provideHttpClient(),
				provideRouter([]),
				provideMockStore({ initialState: initialAppState }),
				{ provide: GlobalErrorService, useValue: globalErrors },
			],
		});
		TestBed.overrideComponent(DefectV2Component, { set: { template: '' } });
		store = TestBed.inject(MockStore);
		store.overrideSelector(selectRouteParams, {});
		store.overrideSelector(toEditOrNotToEdit, undefined);
		store.overrideSelector(defects, [taxonomy]);
		fixture = TestBed.createComponent(DefectV2Component);
		component = fixture.componentInstance;
		testService = TestBed.inject(TestService);
		testService.form.controls.vehicleType.setValue('hgv');
		router = TestBed.inject(Router);
		vi.spyOn(router, 'navigate').mockResolvedValue(true);
	});

	function setRoute(params: Record<string, string>) {
		store.overrideSelector(selectRouteParams, params);
		store.refreshState();
	}

	describe('initialisation', () => {
		it('populates a new dangerous defect and location options from the taxonomy', async () => {
			setRoute({ ref: '1.2.a' });

			await component.ngOnInit();

			expect(component.form.getRawValue()).toMatchObject({
				imNumber: 1,
				imDescription: 'Brakes',
				itemNumber: 2,
				itemDescription: 'Brake condition:',
				deficiencyRef: '1.2.a',
				deficiencyCategory: 'dangerous',
				deficiencyId: 'a',
				deficiencySubId: 'i',
				deficiencyText: 'Brake inoperative',
				stdForProhibition: false,
				media: [{ type: 'failReason', reason: 'Contingency test', path: ' ' }],
			});
			expect(component.form.controls.prohibitionIssued.invalid).toBe(true);
			expect(component.additionalInfoMultiOptions).toEqual({
				vertical: [
					{ value: 'upper', label: 'Upper' },
					{ value: 'lower', label: 'Lower' },
				],
				axleNumber: [
					{ value: 1, label: '1' },
					{ value: 2, label: '2' },
				],
			});
		});

		it('creates an advisory from an item and removes its trailing colon', async () => {
			setRoute({ ref: '1.2.advisory' });

			await component.ngOnInit();

			expect(component.form.getRawValue()).toMatchObject({
				deficiencyRef: '1.2',
				deficiencyCategory: 'advisory',
				itemDescription: 'Brake condition',
				prohibitionIssued: false,
				stdForProhibition: false,
				media: [],
			});
			expect(component.form.controls.additionalInformation.controls.notes.invalid).toBe(true);
		});

		it('preserves the values of an existing defect instead of replacing them from the taxonomy', async () => {
			const defect = {
				imNumber: 1,
				deficiencyRef: '1.2.a',
				deficiencyCategory: 'dangerous',
				stdForProhibition: true,
				prohibitionIssued: true,
				additionalInformation: { notes: 'Existing notes', location: { axleNumber: 2 } },
				media: [],
			} as DefectDetailsSchema;
			testService.form.controls.testTypes.at(0).controls.defects.setValue([defect]);
			setRoute({ defectIndex: '0', ref: '1.2.advisory' });

			await component.ngOnInit();

			expect(component.form.getRawValue()).toMatchObject(defect);
			expect(component.form.valid).toBe(true);
		});

		it('revalidates notes after all sibling values have been patched', async () => {
			testService.form.controls.testTypes.at(0).controls.defects.setValue([
				{
					deficiencyCategory: 'dangerous',
					stdForProhibition: true,
					prohibitionIssued: false,
					additionalInformation: { notes: null },
				} as DefectDetailsSchema,
			]);
			setRoute({ defectIndex: '0' });

			await component.ngOnInit();

			const notes = component.form.controls.additionalInformation.controls.notes;
			expect(notes.hasError('required')).toBe(true);
			component.form.controls.prohibitionIssued.setValue(true);
			expect(notes.valid).toBe(true);
			component.form.controls.prohibitionIssued.setValue(false);
			expect(notes.hasError('required')).toBe(true);
		});

		it('leaves a new form untouched when no route reference is supplied', async () => {
			const initialValue = component.form.getRawValue();
			await component.ngOnInit();
			expect(component.form.getRawValue()).toEqual(initialValue);
			expect(component.additionalInfoMultiOptions).toEqual({});
		});
	});

	describe('taxonomy defaults', () => {
		it('adds a contingency media reason for ADAS advisories', () => {
			component.populateDefectFromTaxonomy({ ...taxonomy, imNumber: 29 }, taxonomy.items[0], undefined);
			expect(component.form.controls.media.value).toEqual([
				{ type: 'failReason', reason: 'Contingency test', path: ' ' },
			]);
		});

		it('preserves item descriptions without a trailing colon', () => {
			component.populateDefectFromTaxonomy(taxonomy, { ...taxonomy.items[0], itemDescription: 'Brakes' }, undefined);
			expect(component.form.controls.itemDescription.value).toBe('Brakes');
		});

		it.each(['car', 'lgv', 'motorcycle'] as const)('does not build location options for %s', (vehicleType) => {
			testService.form.controls.vehicleType.setValue(vehicleType);
			component.populateAdditionalInfoFromTaxonomy(taxonomy);
			expect(component.additionalInfoMultiOptions).toEqual({});
		});

		it.each(['psv', 'trl'] as const)('handles missing %s location taxonomy', (vehicleType) => {
			testService.form.controls.vehicleType.setValue(vehicleType);
			component.populateAdditionalInfoFromTaxonomy(taxonomy);
			expect(component.additionalInfoMultiOptions).toEqual({});
		});
	});

	describe('validation', () => {
		it.each([
			['advisory', false, false, true, false],
			['major', false, false, false, false],
			['minor', false, false, false, false],
			['dangerous', false, false, false, true],
			['dangerous', false, true, false, true],
			['dangerous', true, false, true, false],
			['dangerous', true, true, false, false],
		] as const)(
			'checks notes and prohibition requirements for %s (standard: %s, issued: %s)',
			(deficiencyCategory, stdForProhibition, prohibitionIssued, notesRequired, prohibitionRequired) => {
				component.form.patchValue({ deficiencyCategory, stdForProhibition, prohibitionIssued });
				component.revalidateSiblingDependentControls();
				expect(component.isNotesRequired()).toBe(notesRequired);
				expect(component.isProhibitionIssuedRequired()).toBe(prohibitionRequired);
				expect(component.form.controls.additionalInformation.controls.notes.invalid).toBe(notesRequired);
				expect(component.form.controls.prohibitionIssued.invalid).toBe(prohibitionRequired && !prohibitionIssued);
			}
		);

		it('rejects an unanswered prohibition question for a dangerous defect without a standard', () => {
			component.form.patchValue({ deficiencyCategory: 'dangerous', stdForProhibition: false, prohibitionIssued: null });
			component.revalidateSiblingDependentControls();
			expect(component.form.controls.prohibitionIssued.hasError('required')).toBe(true);
		});

		it('accepts 500 characters of notes and rejects 501', () => {
			const notes = component.form.controls.additionalInformation.controls.notes;
			notes.setValue('a'.repeat(500));
			expect(notes.valid).toBe(true);
			notes.setValue('a'.repeat(501));
			expect(notes.hasError('maxLength')).toBe(true);
		});

		it('updates category predicates when form values change', () => {
			expect(component.isDangerous()).toBe(false);
			expect(component.isAdvisory()).toBe(false);
			expect(component.isDangerousAsterisk()).toBe(false);
			component.form.patchValue({ deficiencyCategory: 'dangerous', stdForProhibition: true });
			expect(component.isDangerous()).toBe(true);
			expect(component.isDangerousAsterisk()).toBe(true);
			component.form.patchValue({ deficiencyCategory: 'advisory', stdForProhibition: false });
			expect(component.isDangerous()).toBe(false);
			expect(component.isDangerousAsterisk()).toBe(false);
			expect(component.isAdvisory()).toBe(true);
		});
	});

	describe('saving and navigation', () => {
		it('shows validation errors and keeps an invalid defect on the form', () => {
			component.form.controls.additionalInformation.controls.notes.setValue('a'.repeat(501));
			const errors = [{ error: 'Notes must be 500 characters or fewer', anchorLink: 'notes' }];
			globalErrors.extractGlobalErrors.mockReturnValue(errors);
			const dispatch = vi.spyOn(store, 'dispatch');

			component.onConfirm();

			expect(component.form.controls.additionalInformation.controls.notes.touched).toBe(true);
			expect(globalErrors.extractGlobalErrors).toHaveBeenCalledWith(component.form);
			expect(globalErrors.setErrors).toHaveBeenCalledWith(errors);
			expect(dispatch).not.toHaveBeenCalled();
			expect(router.navigate).not.toHaveBeenCalled();
		});

		it.each([undefined, '0', '2'])(
			'saves a valid defect with route index %s and recalculates the test result',
			(index) => {
				if (index !== undefined) setRoute({ defectIndex: index });
				component.form.patchValue({ deficiencyCategory: 'major', deficiencyRef: '1.2.a' });
				const defect = component.form.getRawValue() as DefectDetailsSchema;
				const dispatch = vi.spyOn(store, 'dispatch');

				component.onConfirm();

				expect(component.isEditingDefect()).toBe(index !== undefined);
				expect(dispatch.mock.calls.map(([action]) => action)).toEqual([
					index === undefined ? createDefect({ defect }) : updateDefect({ defect, index: Number(index) }),
					updateResultOfTest(),
				]);
				expect(router.navigate).toHaveBeenCalledWith(['../..'], {
					relativeTo: TestBed.inject(ActivatedRoute),
					queryParamsHandling: 'preserve',
				});
			}
		);

		it('cancels without adding or updating a defect', () => {
			const dispatch = vi.spyOn(store, 'dispatch');
			component.onCancel();
			expect(dispatch.mock.calls.map(([action]) => action)).toEqual([updateResultOfTest()]);
			expect(router.navigate).toHaveBeenCalledOnce();
		});

		it('removes the selected defect before recalculating the result and navigating back', () => {
			setRoute({ defectIndex: '2' });
			const dispatch = vi.spyOn(store, 'dispatch');
			component.onRemove();
			expect(dispatch.mock.calls.map(([action]) => action)).toEqual([removeDefect({ index: 2 }), updateResultOfTest()]);
			expect(router.navigate).toHaveBeenCalledOnce();
		});
	});

	describe('media', () => {
		it('selects the defect at the route index from the test result', () => {
			const defect = { deficiencyRef: '1.2.a' } as DefectDetailsSchema;
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ defects: [{}, defect] }] } as TestResultSchema);
			setRoute({ defectIndex: '1' });
			expect(component.defect()).toEqual(defect);
		});

		it('does not attempt media loading when there is no selected test result', async () => {
			await component.loadMediaItems();
			expect(component.loading()).toBe(false);
			expect(component.getFailureToCaptureDefectMediaReason()).toBe('No media available');
		});

		it('uses the stored failure reason when the optional media service is unavailable', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ defects: [{ media: [{ type: 'failReason', reason: 'Contingency test' }] }] }],
			} as TestResultSchema);
			setRoute({ defectIndex: '0' });
			expect(component.getFailureToCaptureDefectMediaReason()).toBe('No media available - Contingency test');
		});

		it('shows the media fetch error when no failure reason was recorded', () => {
			component.defectMediaService = {
				getMediaFetchError: vi.fn().mockReturnValue({ message: 'Media could not be found' }),
			} as unknown as DefectMediaService;
			store.overrideSelector(toEditOrNotToEdit, {
				testResultId: 'result-1',
				testTypes: [{ defects: [{ media: [] }] }],
			} as TestResultSchema);
			setRoute({ defectIndex: '0' });
			expect(component.getFailureToCaptureDefectMediaReason()).toBe('Media could not be found');
			expect(component.defectMediaService.getMediaFetchError).toHaveBeenCalledWith('result-1');
		});
	});
});
