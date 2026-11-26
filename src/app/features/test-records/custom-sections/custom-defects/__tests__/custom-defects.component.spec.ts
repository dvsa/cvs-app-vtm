import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CustomDefectsComponent } from '../custom-defects.component';

describe('CustomDefectsComponent', () => {
	let fixture: ComponentFixture<CustomDefectsComponent>;
	let component: CustomDefectsComponent;
	let store: MockStore;
	let testService: TestService;

	const customDefect = { defectName: 'Defect', defectNotes: 'Notes' };

	const createComponent = (mode: Modes, customDefects = [customDefect]) => {
		store.overrideSelector(toEditOrNotToEdit, {
			testTypes: [{ testTypeId: '126', customDefects }],
		} as TestResultSchema);
		store.refreshState();
		testService.patch({ testTypes: [{ customDefects }] });

		fixture = TestBed.createComponent(CustomDefectsComponent);
		component = fixture.componentInstance;
		testService.mode.set(mode);
		fixture.detectChanges();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CustomDefectsComponent],
			providers: [provideRouter([]), provideMockStore({ initialState: initialAppState })],
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

	it('should populate a form for each additional defect when editing', async () => {
		createComponent(Modes.EDIT);
		await fixture.whenStable();
		fixture.detectChanges();

		expect(testService.value().testTypes[0].customDefects).toEqual([customDefect]);
		expect((fixture.nativeElement.querySelector('#defectName-0') as HTMLInputElement).value).toBe('Defect');
		expect((fixture.nativeElement.querySelector('#defectNotes-0') as HTMLTextAreaElement).value).toBe('Notes');
	});

	it('should copy changes to the additional defects back to the test result', () => {
		createComponent(Modes.EDIT);
		const customDefects = testService.testType.customDefects();

		component.onAddCustomDefect();
		expect(customDefects.value()).toMatchObject([customDefect, { defectName: null, defectNotes: null }]);

		component.onRemoveCustomDefect(0);
		expect(customDefects.value()).toMatchObject([{ defectName: null, defectNotes: null }]);
	});

	it('copies edited defect fields to the shared form before review', () => {
		createComponent(Modes.EDIT);
		const defect = testService.testType.customDefects[0];
		defect.defectName().value.set('Updated defect');
		defect.defectNotes().value.set('Updated notes');

		expect(testService.value().testTypes[0].customDefects).toEqual([
			{ defectName: 'Updated defect', defectNotes: 'Updated notes' },
		]);
	});

	it('does not mutate frozen test-result data when validating defects', () => {
		const defect = Object.freeze({ referenceNumber: '', defectName: 'Defect', defectNotes: 'Notes' });
		const data = [defect];
		Object.freeze(data);
		store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '126' }] } as TestResultSchema);
		store.refreshState();
		testService.patch({ testTypes: [{ customDefects: data }] });

		expect(testService.testType.customDefects().valid()).toBe(true);
		expect(Object.getOwnPropertySymbols(defect)).toEqual([]);
		const payload = testService.value().testTypes[0].customDefects;
		expect(Object.getOwnPropertySymbols(payload[0])).toEqual([]);
		Object.freeze(payload[0]);
		expect(() => testService.patch({ testTypes: [{ customDefects: [defect] }] })).not.toThrow();
	});

	it('preserves and resets the migrated collections and central documents', () => {
		const standard = {
			sectionNumber: '1',
			sectionDescription: 'Section',
			rsNumber: 1,
			requiredStandard: 'Standard',
			refCalculation: '1',
			additionalInfo: false,
			prs: false,
		};
		testService.patch({
			testTypes: [
				{
					customDefects: [customDefect],
					requiredStandards: [standard],
					centralDocs: { issueRequired: true, notes: 'Notes', reasonsForIssue: ['Replacement'] },
				},
			],
		});

		expect(testService.value().testTypes[0]).toMatchObject({
			customDefects: [customDefect],
			requiredStandards: [standard],
			centralDocs: { issueRequired: true, notes: 'Notes', reasonsForIssue: ['Replacement'] },
		});

		testService.resetForm();
		expect(testService.value().testTypes[0]).toMatchObject({
			customDefects: [],
			requiredStandards: undefined,
			centralDocs: { issueRequired: false, notes: ' ', reasonsForIssue: [] },
		});
	});

	describe('validation', () => {
		it('should report every invalid field of the additional defects against the test result', () => {
			createComponent(Modes.EDIT);
			component.onAddCustomDefect();

			expect(
				testService.testType.customDefects[1]
					.defectName()
					.errors()
					.map((error) => error.message)
			).toEqual(['Defect Name is required']);
			expect(
				testService.testType.customDefects[1]
					.defectNotes()
					.errors()
					.map((error) => error.message)
			).toEqual(['Defect Notes is required']);
			expect(
				TestBed.inject(GlobalErrorService).extractSignalFormErrors(testService.form, testService.errorAnchor)
			).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ error: 'Defect Name is required', anchorLink: 'defectName-1' }),
					expect.objectContaining({ error: 'Defect Notes is required', anchorLink: 'defectNotes-1' }),
				])
			);
		});

		it('should limit the defect name to 200 characters', () => {
			createComponent(Modes.EDIT);
			const defectName = testService.testType.customDefects[0].defectName();
			defectName.value.set('a'.repeat(200));
			expect(defectName.errors()).toEqual([]);
			defectName.value.set('a'.repeat(201));

			expect(defectName.errors().map((error) => error.message)).toEqual([
				'Defect Name must be less than or equal to 200 characters',
			]);
		});

		it('should limit the defect notes to 500 characters', () => {
			createComponent(Modes.EDIT);
			const defectNotes = testService.testType.customDefects[0].defectNotes();
			defectNotes.value.set('a'.repeat(500));
			expect(defectNotes.errors()).toEqual([]);
			defectNotes.value.set('a'.repeat(501));
			expect(defectNotes.errors().map((error) => error.message)).toEqual([
				'Defect Notes must be less than or equal to 500 characters',
			]);
		});

		it('should be valid when every additional defect is complete', () => {
			createComponent(Modes.EDIT);

			const customDefects = testService.testType.customDefects();
			expect(customDefects.valid()).toBe(true);
		});

		it('should mark the additional defects as touched when the test result is touched', () => {
			createComponent(Modes.EDIT);

			testService.form().markAsTouched();
			TestBed.tick();

			expect(testService.testType.customDefects[0].defectName().touched()).toBe(true);
		});
	});
});
