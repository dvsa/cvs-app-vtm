import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { GlobalWarningService } from '@/src/app/core/components/global-warning/global-warning.service';
import { UserService } from '@/src/app/services/user-service/user-service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { Modes } from '@models/modes.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, ReplaySubject } from 'rxjs';
import { TestRecordV2Component } from '../test-record-v2.component';

const MockUserService = {
	getUserName$: jest.fn().mockReturnValue(new Observable()),
};

describe('TestRecordV2Component', () => {
	let fixture: ComponentFixture<TestRecordV2Component>;
	let component: TestRecordV2Component;
	let store: MockStore;
	let globalWarningService: GlobalWarningService;
	let actions$: ReplaySubject<Action>;
	let testRecordsService: TestRecordsService;

	beforeEach(async () => {
		actions$ = new ReplaySubject(1);

		await TestBed.configureTestingModule({
			imports: [TestRecordV2Component],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideRouter([]),
				{ provide: Actions, useValue: actions$ },
				{ provide: UserService, useValue: MockUserService },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		globalWarningService = TestBed.inject(GlobalWarningService);
		testRecordsService = TestBed.inject(TestRecordsService);
		fixture = TestBed.createComponent(TestRecordV2Component);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialise the selected test type when the create page opens', () => {
		fixture.componentRef.setInput('initialMode', Modes.EDIT);
		jest.spyOn(component as never, 'testTypeId').mockReturnValue('94');
		const selectSpy = jest.spyOn(testRecordsService, 'contingencyTestTypeSelected').mockImplementation();

		component.ngOnInit();

		expect(selectSpy).toHaveBeenCalledTimes(1);
		expect(selectSpy).toHaveBeenCalledWith('94');
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

		it('should set global errors when form has validation errors', () => {
			const globalErrorService = TestBed.inject(GlobalErrorService);
			jest
				.spyOn(globalErrorService, 'extractGlobalErrors')
				.mockReturnValue([{ error: 'Test error', anchorLink: 'testField' }]);
			const setErrorsSpy = jest.spyOn(globalErrorService, 'setErrors');

			component.onReview();

			expect(setErrorsSpy).toHaveBeenCalled();
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

	describe('onReview error sorting', () => {
		it('should sort errors by DOM position regardless of form control declaration order', () => {
			const container = document.createElement('div');
			const elFirst = document.createElement('input');
			elFirst.id = 'contingencyTestNumber';
			const elSecond = document.createElement('input');
			elSecond.id = 'testStationPNumber';
			container.appendChild(elFirst);
			container.appendChild(elSecond);
			document.body.appendChild(container);

			const globalErrorService = TestBed.inject(GlobalErrorService);
			jest.spyOn(globalErrorService, 'extractGlobalErrors').mockReturnValue([
				{ error: 'Visit error', anchorLink: 'testStationPNumber' },
				{ error: 'Test error', anchorLink: 'contingencyTestNumber' },
			]);
			const setErrorsSpy = jest.spyOn(globalErrorService, 'setErrors');

			component.onReview();

			expect(setErrorsSpy).toHaveBeenCalledWith([
				{ error: 'Test error', anchorLink: 'contingencyTestNumber' },
				{ error: 'Visit error', anchorLink: 'testStationPNumber' },
			]);

			document.body.removeChild(container);
		});

		it('should place errors with no matching DOM element at the end', () => {
			const container = document.createElement('div');
			const el = document.createElement('input');
			el.id = 'knownField';
			container.appendChild(el);
			document.body.appendChild(container);

			const globalErrorService = TestBed.inject(GlobalErrorService);
			jest.spyOn(globalErrorService, 'extractGlobalErrors').mockReturnValue([
				{ error: 'Unknown field error', anchorLink: 'unknownField' },
				{ error: 'Known field error', anchorLink: 'knownField' },
			]);
			const setErrorsSpy = jest.spyOn(globalErrorService, 'setErrors');

			component.onReview();

			expect(setErrorsSpy).toHaveBeenCalledWith([
				{ error: 'Known field error', anchorLink: 'knownField' },
				{ error: 'Unknown field error', anchorLink: 'unknownField' },
			]);

			document.body.removeChild(container);
		});
	});

	describe('onCancel', () => {
		it('should set mode back to EDIT', () => {
			fixture.componentRef.setInput('initialMode', Modes.EDIT);
			component.mode.set(Modes.SUMMARY);
			component.onCancel(component.initialMode());

			expect(component.mode()).toBe(Modes.EDIT);
		});

		it('should clear warnings', () => {
			const clearWarningsSpy = jest.spyOn(globalWarningService, 'clearWarnings');
			fixture.componentRef.setInput('initialMode', Modes.EDIT);
			component.onCancel(component.initialMode());

			expect(clearWarningsSpy).toHaveBeenCalled();
		});
	});
});
