import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Params, provideRouter } from '@angular/router';

import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestModeEnum } from '@models/test-results/test-result-view.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';

import { State, initialAppState } from '@store/index';
import { routeEditable, selectRouteData, selectRouteNestedParams } from '@store/router/router.selectors';
import { initialTestResultsState, isTestTypeKeySame, sectionTemplates, testResultInEdit } from '@store/test-records';
import { ReplaySubject, of } from 'rxjs';
import { BaseTestRecordComponent } from '../../../../components/base-test-record/base-test-record.component';
import { VehicleHeaderComponent } from '../../../../components/vehicle-header/vehicle-header.component';
import { TestAmendmentHistoryComponent } from '../../../components/test-amendment-history/test-amendment-history.component';
import { TestRecordComponent } from '../test-record.component';

describe('TestRecordComponent', () => {
	let component: TestRecordComponent;
	let fixture: ComponentFixture<TestRecordComponent>;
	let el: DebugElement;
	let store: MockStore<State>;
	let testRecordsService: TestRecordsService;
	const actions$ = new ReplaySubject<Action>();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BaseTestRecordComponent, TestAmendmentHistoryComponent, TestRecordComponent, VehicleHeaderComponent],
			providers: [
				TestRecordsService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				RouterService,
				provideMockActions(() => actions$),
				{
					provide: UserService,
					useValue: {
						roles$: of(['TestResult.Amend']),
					},
				},
				TechnicalRecordService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestRecordComponent);
		component = fixture.componentInstance;
		el = fixture.debugElement;
		store = TestBed.inject(MockStore);
		store.overrideSelector(routeEditable, false);
		testRecordsService = TestBed.inject(TestRecordsService);

		store.resetSelectors();
		store.overrideSelector(selectRouteNestedParams, { testResultId: '1', testNumber: 'foo' } as Params);
		store.overrideSelector(selectRouteData, { isEditing: false });
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should not display anything when there is no data', waitForAsync(() => {
		component.testResult$ = of(undefined);

		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('h1'))).toBeNull();
	}));

	describe('button actions', () => {
		beforeEach(() => {
			jest
				.spyOn(testRecordsService, 'testResult$', 'get')
				.mockReturnValue(of({ vehicleType: 'psv', testTypes: [{ testTypeId: '1' }] } as TestResultModel));
		});

		it('should display review button when edit query param is true', waitForAsync(() => {
			store.overrideSelector(routeEditable, true);
			jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));

			fixture.detectChanges();
			expect(el.query(By.css('button#review-test-result'))).toBeTruthy();
		}));

		it('should run handleSave when save button is clicked', waitForAsync(() => {
			store.overrideSelector(routeEditable, true);
			component.testMode = TestModeEnum.View;

			jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));

			fixture.detectChanges();

			const saveSpy = jest.spyOn(component, 'handleSave');
			el.query(By.css('button#save-test-result')).nativeElement.click();
			expect(saveSpy).toHaveBeenCalledTimes(1);
		}));

		it('should run handleReview when review button is clicked', waitForAsync(() => {
			store.overrideSelector(routeEditable, true);

			jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));

			fixture.detectChanges();

			const reviewSpy = jest.spyOn(component, 'handleReview');
			el.query(By.css('button#review-test-result')).nativeElement.click();
			expect(reviewSpy).toHaveBeenCalledTimes(1);
		}));
	});

	describe('TestRecordComponent.prototype.handleSave.name', () => {
		beforeEach(() => {
			store.setState({
				...initialAppState,
				testRecords: {
					...initialTestResultsState,
					ids: ['1'],
					entities: { 1: { testTypes: [{ testNumber: 'foo' }] } as TestResultModel },
					editingTestResult: { testTypes: [{ testNumber: 'foo' }] } as TestResultModel,
				},
			});
		});

		it('should return without calling updateTestResultState if forms are clean', fakeAsync(async () => {
			store.overrideSelector(isTestTypeKeySame('testTypeId'), true);
			const updateTestResultStateSpy = jest.spyOn(testRecordsService, 'updateTestResult');
			await component.handleSave();
			expect(updateTestResultStateSpy).not.toHaveBeenCalled();
		}));

		it('should return without calling updateTestResultState if any forms are invalid', fakeAsync(async () => {
			const updateTestResultStateSpy = jest.spyOn(testRecordsService, 'updateTestResult');
			component.isAnyFormDirty = jest.fn().mockReturnValue(true);
			component.isAnyFormInvalid = jest.fn().mockReturnValue(true);
			await component.handleSave();
			expect(updateTestResultStateSpy).not.toHaveBeenCalled();
		}));

		it('should call updateTestResult with value of all forms merged into one', async () => {
			fixture.detectChanges();
			const updateTestResultStateSpy = jest
				.spyOn(testRecordsService, 'updateTestResult')
				.mockImplementation(() => true);
			const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
			store.overrideSelector(isTestTypeKeySame('testTypeId'), false);
			store.overrideSelector(testResultInEdit, testRecord);
			store.overrideSelector(sectionTemplates, Object.values(masterTpl.psv['testTypesGroup1'] ?? ''));

			component.isAnyFormDirty = jest.fn().mockReturnValue(true);
			component.isAnyFormInvalid = jest.fn().mockReturnValue(false);

			await component.handleSave();

			fixture.detectChanges();
			expect(updateTestResultStateSpy).toHaveBeenCalledTimes(1);
			expect(updateTestResultStateSpy).toHaveBeenCalledWith(testRecord);
		});
	});

	describe('Render banner', () => {
		beforeEach(() => {
			jest
				.spyOn(testRecordsService, 'testResult$', 'get')
				.mockReturnValue(of({ vehicleType: 'psv', testTypes: [{ testTypeId: '1' }] } as TestResultModel));
		});

		it('should render the banner if the test type id is not supported', waitForAsync(() => {
			jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(false));
			fixture.detectChanges();
			const banner = el.query(By.css('div.govuk-notification-banner'));
			expect(banner).toBeTruthy();
		}));

		it('should not render the banner if the test type id is supported', fakeAsync(() => {
			jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));
			tick();
			fixture.detectChanges();
			const banner = el.query(By.css('div.govuk-notification-banner'));
			expect(banner).toBeNull();
		}));
	});

	it('should set testMode to be view when has errors is false', async () => {
		expect(component.testMode).toEqual(TestModeEnum.Edit);

		const errorsSpy = jest.spyOn(component, 'hasErrors').mockReturnValue(Promise.resolve(false));
		await component.handleReview();

		expect(errorsSpy).toHaveBeenCalledTimes(1);

		expect(component.testMode).toEqual(TestModeEnum.View);
	});

	it('should not set testMode to be view when has errors is true', async () => {
		expect(component.testMode).toEqual(TestModeEnum.Edit);

		const errorsSpy = jest.spyOn(component, 'hasErrors').mockReturnValue(Promise.resolve(true));
		await component.handleReview();

		expect(errorsSpy).toHaveBeenCalledTimes(1);

		expect(component.testMode).toEqual(TestModeEnum.Edit);
	});

	it('should set testMode back to edit', () => {
		component.testMode = TestModeEnum.View;
		component.handleCancel();

		expect(component.testMode).toEqual(TestModeEnum.Edit);
	});
});
