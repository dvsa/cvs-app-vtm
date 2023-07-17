import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultService as CreateTestResultsService, GetTestResultsService, UpdateTestResultsService } from '@api/test-results';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required.directive';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { contingencyTestTemplates } from '@forms/templates/test-records/create-master.template';
import { mockTestResult } from '@mocks/mock-test-result';
import { Roles } from '@models/roles.enum';
import { TestModeEnum } from '@models/test-results/test-result-view.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { ButtonGroupComponent } from '@shared/components/button-group/button-group.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { NumberPlateComponent } from '@shared/components/number-plate/number-plate.component';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TestTypeNamePipe } from '@shared/pipes/test-type-name/test-type-name.pipe';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/.';
import { sectionTemplates, testResultInEdit, toEditOrNotToEdit } from '@store/test-records';
import { Observable, of, ReplaySubject } from 'rxjs';
import { BaseTestRecordComponent } from '../../../components/base-test-record/base-test-record.component';
import { VehicleHeaderComponent } from '../../../components/vehicle-header/vehicle-header.component';
import { CreateTestRecordComponent } from './create-test-record.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

describe('CreateTestRecordComponent', () => {
  let component: CreateTestRecordComponent;
  let fixture: ComponentFixture<CreateTestRecordComponent>;
  let actions$ = new ReplaySubject<Action>();
  let router: Router;
  let testRecordsService: TestRecordsService;
  let store: MockStore<State>;

  const mockTechnicalRecordService = {
    get viewableTechRecord$() {
      return mockVehicleTechnicalRecord().techRecord.pop();
    }
  };
  const MockUserService = {
    getUserName$: jest.fn().mockReturnValue(new Observable()),
    roles$: of([Roles.TestResultAmend, Roles.TestResultView])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CreateTestRecordComponent,
        BaseTestRecordComponent,
        DefaultNullOrEmpty,
        TestTypeNamePipe,
        ButtonComponent,
        ButtonGroupComponent,
        IconComponent,
        NumberPlateComponent,
        VehicleHeaderComponent,
        RoleRequiredDirective
      ],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [
        GlobalErrorService,
        RouterService,
        TestRecordsService,
        GetTestResultsService,
        UpdateTestResultsService,
        CreateTestResultsService,
        { provide: UserService, useValue: MockUserService },
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$),
        { provide: TechnicalRecordService, useValue: mockTechnicalRecordService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestRecordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    testRecordsService = TestBed.inject(TestRecordsService);
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to the tech record', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    component.backToTechRecord();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should call createTestResult with value of all forms merged into one', async () => {
    fixture.detectChanges();
    const createTestResultSpy = jest.spyOn(testRecordsService, 'createTestResult').mockImplementation(() => {});
    const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
    store.overrideSelector(testResultInEdit, testRecord);
    store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1']!));

    component.isAnyFormInvalid = jest.fn().mockReturnValue(false);

    await component.handleSave();
    fixture.detectChanges();
    expect(createTestResultSpy).toHaveBeenCalledTimes(1);
    expect(createTestResultSpy).toHaveBeenCalledWith(testRecord);
  });

  it('should not call createTestResult if some forms are invalid', async () => {
    const createTestResultSpy = jest.spyOn(testRecordsService, 'createTestResult').mockImplementation(() => {});
    const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
    store.overrideSelector(testResultInEdit, testRecord);
    store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1']!));

    fixture.detectChanges();
    component.isAnyFormInvalid = jest.fn().mockReturnValue(true);

    await component.handleSave();

    expect(createTestResultSpy).not.toHaveBeenCalled();
  });

  it('should dispatch the action to update the test result in edit', () => {
    const updateTestResultSpy = jest.spyOn(testRecordsService, 'updateEditingTestResult').mockImplementation(() => {});
    component.handleNewTestResult({} as TestResultModel);
    expect(updateTestResultSpy).toHaveBeenCalled();
  });

  describe(CreateTestRecordComponent.prototype.isAnyFormInvalid.name, () => {
    let mockSestResultInEditSelector: MemoizedSelector<any, TestResultModel | undefined, DefaultProjectorFn<TestResultModel | undefined>>;
    let mockToEditOrNotToEditSelector: MemoizedSelector<any, TestResultModel | undefined, DefaultProjectorFn<TestResultModel | undefined>>;
    beforeEach(() => {
      mockSestResultInEditSelector = store.overrideSelector(testResultInEdit, mockTestResult());
      mockToEditOrNotToEditSelector = store.overrideSelector(toEditOrNotToEdit, undefined);
    });

    afterEach(() => {
      store.resetSelectors();
    });

    it('should return true if some forms are invalid', fakeAsync(() => {
      const mockTest = mockTestResult();
      mockTest.countryOfRegistration = '';
      mockSestResultInEditSelector.setResult(mockTest);
      mockToEditOrNotToEditSelector.setResult(mockTest);
      store.refreshState();

      tick();
      fixture.detectChanges();
      tick();

      expect(component.isAnyFormInvalid()).toBe(true);
      discardPeriodicTasks();
    }));

    it('should return false if no forms are invalid', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      expect(component.isAnyFormInvalid()).toBe(false);
      flush();
    }));
  });

  describe(CreateTestRecordComponent.prototype.abandon.name, () => {
    it('should set testMode to be abandon', () => {
      component.abandon();
      expect(component.testMode).toEqual(TestModeEnum.Abandon);
    });
  });

  describe(CreateTestRecordComponent.prototype.handleAbandonAction.name, () => {
    it('should call handle save', () => {
      const handleSaveSpy = jest.spyOn(component, 'handleSave');

      component.handleAbandonAction('yes');

      expect(handleSaveSpy).toBeCalledTimes(1);
    });

    it('should set testMode to be edit', () => {
      component.testMode = TestModeEnum.Abandon;

      component.handleAbandonAction('no');

      expect(component.testMode).toEqual(TestModeEnum.Edit);
    });
  });

  it('should combine forms', async () => {
    component['baseTestRecordComponent'] = {
      sections: { forEach: jest.fn().mockReturnValue([{ foo: 'foo' }]) }
    } as unknown as BaseTestRecordComponent;

    const createTestResultSpy = jest.spyOn(testRecordsService, 'createTestResult').mockImplementation(() => Promise.resolve(true));
    const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
    store.overrideSelector(testResultInEdit, testRecord);
    store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1']!));

    fixture.detectChanges();

    await component.handleSave();

    fixture.detectChanges();
    expect(createTestResultSpy).toHaveBeenCalledTimes(1);
    expect(createTestResultSpy).toHaveBeenCalledWith(testRecord);
  });

  it('should set testMode to be view', () => {
    component.isAnyFormInvalid = jest.fn().mockReturnValue(false);
    component.handleReview();

    expect(component.testMode).toEqual(TestModeEnum.View);
  });

  it('should set testMode back to edit', () => {
    component.isAnyFormInvalid = jest.fn().mockReturnValue(false);
    component.handleReview();
    component.handleCancel();

    expect(component.testMode).toEqual(TestModeEnum.Edit);
  });
});
