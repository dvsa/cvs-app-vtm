import { GlobalWarningService } from '@/src/app/core/components/global-warning/global-warning.service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { Modes } from '@models/modes.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestRecordV2Component } from '../test-record-v2.component';

describe('CreateTestRecordV2Component', () => {
	let fixture: ComponentFixture<TestRecordV2Component>;
	let component: TestRecordV2Component;
	let store: MockStore;
	let globalWarningService: GlobalWarningService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestRecordV2Component],
			providers: [provideMockStore({ initialState: initialAppState }), provideRouter([])],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		globalWarningService = TestBed.inject(GlobalWarningService);
		fixture = TestBed.createComponent(TestRecordV2Component);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('onReview', () => {
		it('should set mode to SUMMARY when form is valid', () => {
			component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.FAIL);
			jest.spyOn(component.form, 'markAllAsTouched');
			Object.defineProperty(component.form, 'valid', { get: () => true });

			component.onReview();

			expect(component.form.markAllAsTouched).toHaveBeenCalled();
			expect(component.mode()).toBe(Modes.SUMMARY);
		});

		it('should call handleFormInvalid when form is invalid', () => {
			Object.defineProperty(component.form, 'valid', { get: () => false });
			const handleFormInvalidSpy = jest.spyOn(component as any, 'handleFormInvalid');

			component.onReview();

			expect(handleFormInvalidSpy).toHaveBeenCalled();
		});

		it('should set warning when tech record is provisional and test result is PASS for a first test', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.PASS);
			Object.defineProperty(component.form, 'valid', { get: () => true });

			const setWarningsSpy = jest.spyOn(globalWarningService, 'setWarnings');
			jest.spyOn(component as any, 'testTypeId').mockReturnValue('41');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalledWith([
				{
					warning:
						'This test will update the tech record to current, if the page is showing as provisional then refresh the page',
				},
			]);
		});

		it('should set warning when tech record is provisional and test result is PRS for a first test', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.PRS);
			Object.defineProperty(component.form, 'valid', { get: () => true });

			const setWarningsSpy = jest.spyOn(globalWarningService, 'setWarnings');
			jest.spyOn(component as any, 'testTypeId').mockReturnValue('95');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalledWith([
				{
					warning:
						'This test will update the tech record to current, if the page is showing as provisional then refresh the page',
				},
			]);
		});

		it('should set warning for notifiable alteration test type', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.PASS);
			Object.defineProperty(component.form, 'valid', { get: () => true });

			const setWarningsSpy = jest.spyOn(globalWarningService, 'setWarnings');
			jest.spyOn(component as any, 'testTypeId').mockReturnValue('38');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalled();
		});

		it('should set warning for COIF test type', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.PASS);
			Object.defineProperty(component.form, 'valid', { get: () => true });

			const setWarningsSpy = jest.spyOn(globalWarningService, 'setWarnings');
			jest.spyOn(component as any, 'testTypeId').mockReturnValue('142');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalled();
		});

		it('should set warning for IVA test type', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.PASS);
			Object.defineProperty(component.form, 'valid', { get: () => true });

			const setWarningsSpy = jest.spyOn(globalWarningService, 'setWarnings');
			jest.spyOn(component as any, 'testTypeId').mockReturnValue('133');

			component.onReview();

			expect(setWarningsSpy).toHaveBeenCalled();
		});

		it('should not set warning when tech record is CURRENT', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.CURRENT } as any);
			store.refreshState();

			component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.PASS);
			Object.defineProperty(component.form, 'valid', { get: () => true });

			const setWarningsSpy = jest.spyOn(globalWarningService, 'setWarnings');
			jest.spyOn(component as any, 'testTypeId').mockReturnValue('41');

			component.onReview();

			expect(setWarningsSpy).not.toHaveBeenCalled();
		});

		it('should not set warning when test result is FAIL', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.FAIL);
			Object.defineProperty(component.form, 'valid', { get: () => true });

			const setWarningsSpy = jest.spyOn(globalWarningService, 'setWarnings');
			jest.spyOn(component as any, 'testTypeId').mockReturnValue('41');

			component.onReview();

			expect(setWarningsSpy).not.toHaveBeenCalled();
		});

		it('should not set warning when test type does not qualify', () => {
			store.overrideSelector(techRecord, { techRecord_statusCode: StatusCodes.PROVISIONAL } as any);
			store.refreshState();

			component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.PASS);
			Object.defineProperty(component.form, 'valid', { get: () => true });

			const setWarningsSpy = jest.spyOn(globalWarningService, 'setWarnings');
			jest.spyOn(component as any, 'testTypeId').mockReturnValue('94');

			component.onReview();

			expect(setWarningsSpy).not.toHaveBeenCalled();
		});
	});

	describe('onCancel', () => {
		it('should set mode back to EDIT', () => {
			component.mode.set(Modes.SUMMARY);
			component.onCancel();

			expect(component.mode()).toBe(Modes.EDIT);
		});

		it('should clear warnings', () => {
			const clearWarningsSpy = jest.spyOn(globalWarningService, 'clearWarnings');
			component.onCancel();

			expect(clearWarningsSpy).toHaveBeenCalled();
		});
	});
});
