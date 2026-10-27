import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { testResultInEdit, toEditOrNotToEdit, updateResultOfTestRequiredStandards } from '@/src/app/store/test-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { SpecialistCustomDefectsSchemaPut, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RequiredStandardsComponent } from '../required-standards.component';

describe('RequiredStandardsComponent', () => {
	let fixture: ComponentFixture<RequiredStandardsComponent>;
	let component: RequiredStandardsComponent;
	let store: MockStore;
	let testService: TestService;

	const requiredStandard = {
		refCalculation: '1.1',
		requiredStandard: 'A required standard',
		prs: true,
	} as SpecialistCustomDefectsSchemaPut;

	const createComponent = (mode: Modes, testResult?: Partial<TestResultSchema>) => {
		store.overrideSelector(toEditOrNotToEdit, testResult as TestResultSchema);
		store.overrideSelector(testResultInEdit, testResult as TestResultSchema);
		store.refreshState();

		fixture = TestBed.createComponent(RequiredStandardsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('mode', mode);
		fixture.detectChanges();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RequiredStandardsComponent],
			providers: [provideRouter([]), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		testService = TestBed.inject(TestService);
		testService.form.reset();
		vi.spyOn(store, 'dispatch');
	});

	afterEach(() => {
		store.resetSelectors();
	});

	it('should create', () => {
		createComponent(Modes.EDIT);
		expect(component).toBeTruthy();
	});

	it('should list the required standards on the test result', () => {
		createComponent(Modes.VIEW, { testTypes: [{ requiredStandards: [requiredStandard] }] } as TestResultSchema);

		const element: HTMLElement = fixture.nativeElement;
		expect(element.querySelector('#required-standard-0')?.textContent).toContain('1.1');
		expect(element.querySelector('#add-rs-button')).toBeNull();
	});

	it('should show that there are no required standards', () => {
		createComponent(Modes.VIEW, { testTypes: [{}] } as TestResultSchema);

		expect(fixture.nativeElement.textContent).toContain('No required standards');
	});

	it('should not recalculate the test result when viewing', () => {
		createComponent(Modes.VIEW, { testTypes: [{}] } as TestResultSchema);

		expect(store.dispatch).not.toHaveBeenCalledWith(updateResultOfTestRequiredStandards());
	});

	it('should recalculate the test result from the required standards when editing', () => {
		createComponent(Modes.EDIT, { testTypes: [{ testResult: TestResults.PASS }] } as TestResultSchema);

		expect(store.dispatch).toHaveBeenCalledWith(updateResultOfTestRequiredStandards());
		expect(testService.form.controls.testTypes.at(0).controls.testResult.value).toBe(TestResults.PASS);
	});

	it('should clear the required standards when the EU vehicle category changes', () => {
		createComponent(Modes.EDIT, { testTypes: [{ testResult: TestResults.PRS }] } as TestResultSchema);
		const requiredStandards = testService.form.controls.testTypes.at(0).controls.requiredStandards;
		requiredStandards.setValue([requiredStandard]);

		testService.form.controls.euVehicleCategory.setValue('m1' as never);

		expect(requiredStandards.value).toEqual([]);
	});

	describe('onAddRequiredStandard', () => {
		it('should raise an error when the EU vehicle category has not been selected', () => {
			createComponent(Modes.EDIT, { testTypes: [{}] } as TestResultSchema);
			const router = TestBed.inject(Router);
			const errorService = TestBed.inject(GlobalErrorService);
			vi.spyOn(router, 'navigate');
			vi.spyOn(errorService, 'setErrors');

			component.onAddRequiredStandard();

			expect(errorService.setErrors).toHaveBeenCalledWith([
				{ error: 'EU Vehicle Category is required', anchorLink: 'euVehicleCategory' },
			]);
			expect(router.navigate).not.toHaveBeenCalled();
		});

		it('should navigate to select a required standard', () => {
			createComponent(Modes.EDIT, { testTypes: [{}] } as TestResultSchema);
			const router = TestBed.inject(Router);
			vi.spyOn(router, 'navigate').mockResolvedValue(true);
			testService.form.controls.euVehicleCategory.setValue('m1' as never);

			component.onAddRequiredStandard();

			expect(router.navigate).toHaveBeenCalledWith(['selectRequiredStandard'], expect.anything());
		});
	});
});
