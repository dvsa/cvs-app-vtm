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
		fixture.componentRef.setInput('mode', mode);
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
		expect(customDefects.value).toEqual([customDefect, { defectName: null, defectNotes: null }]);

		component.onRemoveCustomDefect(0);
		expect(customDefects.value).toEqual([{ defectName: null, defectNotes: null }]);
	});

	describe('validation', () => {
		it('should report every invalid field of the additional defects against the test result', () => {
			createComponent(Modes.EDIT);
			component.onAddCustomDefect();

			const customDefects = testService.form.controls.testTypes.at(0).controls.customDefects;
			customDefects.updateValueAndValidity();

			expect(customDefects.errors).toEqual({
				customDefects: [
					expect.objectContaining({ error: 'Defect Name is required', anchorLink: 'defectName-1' }),
					expect.objectContaining({ error: 'Defect Notes is required', anchorLink: 'defectNotes-1' }),
				],
			});
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

			expect(component.customDefectsForm.at(0).controls.defectName.touched).toBe(true);
		});
	});
});
