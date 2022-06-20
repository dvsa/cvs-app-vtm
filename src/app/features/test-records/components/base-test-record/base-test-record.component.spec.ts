import { ComponentFixture, TestBed } from '@angular/core/testing';
import { masterTpl } from '../../../../forms/templates/test-records/master.template';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { initialAppState } from '@store/.';
import { BaseTestRecordComponent } from './base-test-record.component';
import { TestResultModel } from '@models/test-result.model';

describe('BaseTestRecordComponent', () => {
  let component: BaseTestRecordComponent;
  let fixture: ComponentFixture<BaseTestRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseTestRecordComponent],
      providers: [RouterService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template generation', () => {
    it('should return undefined if no test Result', () => {
      component.testResult = undefined;
      expect(component.generateTemplate()).toBeUndefined();
    });

    it('should return undefined if vehicle type is not valid', () => {
      component.testResult = { vehicleType: 'xxx', testCode: 'default' } as TestResultModel;
      expect(component.generateTemplate()).toBeUndefined();
    });

    // TODO: Refactor the test once there are test code specific templates
    it('should return the test code template if the test code is present', () => {
      component.testResult = { vehicleType: 'psv', testCode: 'default' } as TestResultModel;
      expect(component.generateTemplate()).toEqual(Object.values(masterTpl.psv.default!));
    });

    it('should return the default template if the testCode is not defined in the template', () => {
      component.testResult = { vehicleType: 'psv', testCode: 'AAA' } as TestResultModel;
      expect(component.generateTemplate()).toEqual(Object.values(masterTpl.psv.default!));
    });

    it('should return the default template if the testCode is not defined', () => {
      component.testResult = { vehicleType: 'psv' } as TestResultModel;
      expect(component.generateTemplate()).toEqual(Object.values(masterTpl.psv.default!));
    });
  });
});
