import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { initialAppState, State } from '@store/.';
import { Observable, of, ReplaySubject } from 'rxjs';
import { CreateTestRecordComponent } from './create-test-record.component';
import { GetTestResultsService, UpdateTestResultsService, DefaultService as CreateTestResultsService } from '@api/test-results';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TestResultModel } from '@models/test-results/test-result.model';
import { contingencyTestTemplates } from '@forms/templates/test-records/create-master.template';
import { sectionTemplates, testResultInEdit } from '@store/test-records';
import { FormGroup } from '@angular/forms';
import { BaseTestRecordComponent } from '../../../components/base-test-record/base-test-record.component';
import { ButtonGroupComponent } from '@shared/components/button-group/button-group.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TestTypeNamePipe } from '@shared/pipes/test-type-name/test-type-name.pipe';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { ResultOfTestComponent } from '../../../components/result-of-test/result-of-test.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { NumberPlateComponent } from '@shared/components/number-plate/number-plate.component';
import { VehicleHeaderComponent } from '../../../components/vehicle-header/vehicle-header.component';
import { RoleRequiredDirective } from '@directives/app-role-required.directive';
import { UserService } from '@services/user-service/user-service';
import { Roles } from '@models/roles.enum';
import { SharedModule } from '@shared/shared.module';

describe('CreateTestRecordComponent', () => {
  let component: CreateTestRecordComponent;
  let fixture: ComponentFixture<CreateTestRecordComponent>;
  let actions$ = new ReplaySubject<Action>();
  let router: Router;
  let testRecordsService: TestRecordsService;
  let store: MockStore<State>;

  const MockUserService = {
    getUserName$: jest.fn().mockReturnValue(new Observable()),
    roles$: of([Roles.TestResultAmend, Roles.TestResultView])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CreateTestRecordComponent,
        BaseTestRecordComponent,
        ResultOfTestComponent,
        DefaultNullOrEmpty,
        TestTypeNamePipe,
        ButtonComponent,
        ButtonGroupComponent,
        IconComponent,
        NumberPlateComponent,
        VehicleHeaderComponent,
        RoleRequiredDirective
      ],
      imports: [
        DynamicFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        GlobalErrorService,
        RouterService,
        TestRecordsService,
        GetTestResultsService,
        UpdateTestResultsService,
        CreateTestResultsService,
        { provide: UserService, useValue: MockUserService },
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$)
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestRecordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    testRecordsService = TestBed.inject(TestRecordsService);
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to the tech record', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    component.backToTechRecord();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should call createTestResult with value of all forms merged into one', fakeAsync(() => {
    const createTestResultSpy = jest.spyOn(testRecordsService, 'createTestResult').mockImplementation(() => {});
    const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
    store.overrideSelector(testResultInEdit, testRecord);
    store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1']));

    tick();
    fixture.detectChanges();

    component.isAnyFormInvalid = jest.fn().mockReturnValue(false);

    component.handleSave();

    tick();

    expect(createTestResultSpy).toHaveBeenCalledTimes(1);
    expect(createTestResultSpy).toHaveBeenCalledWith(testRecord);
  }));

  it('should not call createTestResult if some forms are invalid', fakeAsync(() => {
    const createTestResultSpy = jest.spyOn(testRecordsService, 'createTestResult').mockImplementation(() => {});
    const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
    store.overrideSelector(testResultInEdit, testRecord);
    store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1']));

    tick();
    fixture.detectChanges();

    component.isAnyFormInvalid = jest.fn().mockReturnValue(true);

    component.handleSave();

    tick();

    expect(createTestResultSpy).not.toHaveBeenCalled();
  }));

  it('should dispatch the action to update the test result in edit', () => {
    const updateTestResultSpy = jest.spyOn(testRecordsService, 'updateEditingTestResult').mockImplementation(() => {});
    component.handleNewTestResult({} as TestResultModel);
    expect(updateTestResultSpy).toHaveBeenCalled();
  });

  it('should return true if some forms are invalid', () => {
    const forms = [{ invalid: true }, { invalid: false }] as FormGroup[];
    expect(component.isAnyFormInvalid(forms)).toBe(true);
  });

  it('should return false if no forms are invalid', () => {
    const forms = [{ invalid: false }, { invalid: false }] as FormGroup[];
    expect(component.isAnyFormInvalid(forms)).toBe(false);
  });

  it('should combine forms', fakeAsync(() => {
    component['baseTestRecordComponent'] = {
      sections: { forEach: jest.fn().mockReturnValue([{ foo: 'foo' }]) }
    } as unknown as BaseTestRecordComponent;

    const createTestResultSpy = jest.spyOn(testRecordsService, 'createTestResult').mockImplementation(() => {});
    const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
    store.overrideSelector(testResultInEdit, testRecord);
    store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1']));

    tick();
    fixture.detectChanges();

    component.handleSave();

    tick();

    expect(createTestResultSpy).toHaveBeenCalledTimes(1);
    expect(createTestResultSpy).toHaveBeenCalledWith(testRecord);
  }));
});
