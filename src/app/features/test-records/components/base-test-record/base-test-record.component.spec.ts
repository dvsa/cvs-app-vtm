import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { TestResultModel } from '@models/test-result.model';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { initialAppState } from '@store/.';
import { BaseTestRecordComponent } from './base-test-record.component';

describe('BaseTestRecordComponent', () => {
  let component: BaseTestRecordComponent;
  let fixture: ComponentFixture<BaseTestRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseTestRecordComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule],
      providers: [RouterService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTestRecordComponent);
    component = fixture.componentInstance;
    component.testResult = {} as TestResultModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(BaseTestRecordComponent.prototype.handleFormChange.name, () => {
    it('should emit the new test result', done => {
      const event = { vin: 'ABC001' } as TestResultModel;
      const expectedValue = { vin: 'ABC001' };

      fixture.detectChanges();

      component.newTestResult.subscribe(testResult => {
        expect(testResult).toEqual(expectedValue);
        done();
      });

      component.handleFormChange(event);
    });
  });

  // describe('template generation', () => {
  //   it('should return undefined if vehicle type is not valid', () => {
  //     component.testResult.vehicleType = 'xxx' as VehicleTypes;
  //     component.testResult.testTypes = [{ testTypeId: '1' } as TestType];
  //     expect(component.generateTemplate()).toBeUndefined();
  //   });

  //   it('should return the test code template if the test code is present', () => {
  //     component.testResultCopy.vehicleType = VehicleTypes.PSV;
  //     component.testResultCopy.testTypes = [{ testTypeId: '1' } as TestType];
  //     expect(component.generateTemplate()).toEqual(Object.values(masterTpl.psv['testTypesGroup1']!));
  //   });

  //   it('should return the default template if the testCode is not defined in the template', () => {
  //     component.testResultCopy.vehicleType = VehicleTypes.PSV;
  //     component.testResultCopy.testTypes = [{ testTypeId: '23455' } as TestType];
  //     expect(component.generateTemplate()).toEqual(Object.values(masterTpl.psv['default']!));
  //   });

  //   it('should return the default template if the testCode is not defined', () => {
  //     component.testResultCopy.vehicleType = VehicleTypes.PSV;
  //     component.testResultCopy.testTypes = [{ testTypeId: '23455' } as TestType];
  //     expect(component.generateTemplate()).toEqual(Object.values(masterTpl.psv['default']!));
  //   });
  // });

  // describe('form generation', () => {
  //   it('should call create form and add it to sectionForms', () => {
  //     component.getFormForTemplate({} as FormNode);
  //     expect(component.sectionForms.length).toBe(1);
  //   });
  // });

  // describe('set dynamicFormGroupComponents', () => {
  //   it('should get form from each component and add it to sectionForms', () => {
  //     const dfm = new DynamicFormGroupComponent(new DynamicFormService());
  //     dfm.form = new CustomFormGroup({ name: 'test', type: FormNodeTypes.GROUP }, {});
  //     component.dynamicFormGroupComponents = [dfm] as unknown as QueryList<DynamicFormGroupComponent>;
  //     expect(component.sectionForms.length).toBe(1);
  //   });
  // });
});
