import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CustomDefectsComponent } from '../custom-defects.component';

describe('CustomDefectsComponent', () => {
	let fixture: ComponentFixture<CustomDefectsComponent>;
	let component: CustomDefectsComponent;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;
	let testService: TestService;

	const customDefect = { defectName: 'Defect', defectNotes: 'Notes' };

	const createComponent = (mode: Modes, customDefects = [customDefect]) => {
		store.overrideSelector(toEditOrNotToEdit, {
			testTypes: [{ testTypeId: '126', customDefects }],
		} as TestResultSchema);
		store.refreshState();
		testService.form.controls.testTypes.at(0).controls.customDefects.setValue(customDefects);

		fixture = TestBed.createComponent(CustomDefectsComponent);
		component = fixture.componentInstance;
		testService.mode.set(mode);
		fixture.detectChanges();
	};

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [CustomDefectsComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				provideRouter([]),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		testService = TestBed.inject(TestService);
	});

	afterEach(() => {
		store.resetSelectors();
	});

	it('should create', () => {
		createComponent(Modes.EDIT);
		expect(component).toBeTruthy();
	});

	it('should display the additional defects when viewing', () => {
		createComponent(Modes.VIEW);

		const element: HTMLElement = fixture.nativeElement;
		expect(element.querySelector('#defectName-0')?.textContent).toContain('Defect');
		expect(element.querySelector('#add-custom-defect')).toBeNull();
	});

	it('should show that there are no additional defects when viewing', () => {
		createComponent(Modes.VIEW, []);

		expect(fixture.nativeElement.textContent).toContain('No Additional Defects');
	});

	it('should populate a form for each additional defect when editing', () => {
		createComponent(Modes.EDIT);

		expect(component.customDefectsForm.getRawValue()).toEqual([customDefect]);
	});

	it('should copy changes to the additional defects back to the test result', () => {
		createComponent(Modes.EDIT);
		const customDefects = testService.form.controls.testTypes.at(0).controls.customDefects;

		component.onAddCustomDefect();
		expect(customDefects.value).toMatchObject([customDefect, { defectName: null, defectNotes: null }]);

		component.onRemoveCustomDefect(0);
		expect(customDefects.value).toMatchObject([{ defectName: null, defectNotes: null }]);
	});

	it('copies edited defect fields to the shared form before review', () => {
		createComponent(Modes.EDIT);
		const defect = component.customDefectsForm.at(0);
		defect.controls.defectName.setValue('Updated defect');
		defect.controls.defectNotes.setValue('Updated notes');

		expect(testService.form.getRawValue().testTypes[0].customDefects).toEqual([
			{ defectName: 'Updated defect', defectNotes: 'Updated notes' },
		]);
	});

	it('does not mutate frozen test-result data when validating defects', () => {
		const defect = Object.freeze({ referenceNumber: '', defectName: 'Defect', defectNotes: 'Notes' });
		const data = [defect];
		Object.freeze(data);
		store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '126' }] } as TestResultSchema);
		store.refreshState();
		testService.customDefects.setValue(data);

		expect(testService.customDefects.valid).toBe(true);
		expect(Object.getOwnPropertySymbols(defect)).toEqual([]);
		const payload = testService.form.getRawValue().testTypes[0].customDefects;
		expect(Object.getOwnPropertySymbols(payload[0])).toEqual([]);
		Object.freeze(payload[0]);
		expect(() => testService.customDefects.setValue([defect])).not.toThrow();
	});

	it('preserves and resets the migrated collections and central documents', () => {
		const testType = testService.form.controls.testTypes.at(0);
		const standard = {
			sectionNumber: '1',
			sectionDescription: 'Section',
			rsNumber: 1,
			requiredStandard: 'Standard',
			refCalculation: '1',
			additionalInfo: false,
			prs: false,
		};
		testType.patchValue({
			customDefects: [customDefect],
			requiredStandards: [standard],
			centralDocs: { issueRequired: true, notes: 'Notes', reasonsForIssue: ['Replacement'] },
		});

		expect(testService.form.getRawValue().testTypes[0]).toMatchObject({
			customDefects: [customDefect],
			requiredStandards: [standard],
			centralDocs: { issueRequired: true, notes: 'Notes', reasonsForIssue: ['Replacement'] },
		});

		testService.resetForm();
		expect(testService.form.getRawValue().testTypes[0]).toMatchObject({
			customDefects: [],
			requiredStandards: undefined,
			centralDocs: { issueRequired: false, notes: ' ', reasonsForIssue: [] },
		});
	});

	describe('validation', () => {
		it('should report every invalid field of the additional defects against the test result', () => {
			createComponent(Modes.EDIT);
			component.onAddCustomDefect();

			const customDefects = testService.form.controls.testTypes.at(0).controls.customDefects;
			customDefects.updateValueAndValidity();

			expect(customDefects.errors).toHaveProperty('customDefects.details', [
				expect.objectContaining({ error: 'Defect Name is required', anchorLink: 'defectName-1' }),
				expect.objectContaining({ error: 'Defect Notes is required', anchorLink: 'defectNotes-1' }),
			]);
			expect(TestBed.inject(GlobalErrorService).extractGlobalErrors(testService.form)).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ error: 'Defect Name is required', anchorLink: 'defectName-1' }),
					expect.objectContaining({ error: 'Defect Notes is required', anchorLink: 'defectNotes-1' }),
				])
			);
		});

		it('should limit the defect name to 200 characters', () => {
			createComponent(Modes.EDIT);
			const defectName = component.customDefectsForm.at(0).controls.defectName;
			defectName.setValue('a'.repeat(201));

			expect(defectName.errors).toHaveProperty('maxLength');
		});

		it('should be valid when every additional defect is complete', () => {
			createComponent(Modes.EDIT);

			const customDefects = testService.form.controls.testTypes.at(0).controls.customDefects;
			customDefects.updateValueAndValidity();

			expect(customDefects.valid).toBe(true);
		});

		it('should mark the additional defects as touched when the test result is touched', () => {
			createComponent(Modes.EDIT);

			testService.form.markAllAsTouched();
			TestBed.tick();

			expect(component.customDefectsForm.at(0).controls.defectName.touched).toBe(true);
		});
	});
});
