import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { initialAppState } from '@store/.';
import { BaseTestRecordComponent } from './base-test-record.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { SharedModule } from '@shared/shared.module';

describe('BaseTestRecordComponent', () => {
  let component: BaseTestRecordComponent;
  let fixture: ComponentFixture<BaseTestRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseTestRecordComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, SharedModule],
      providers: [RouterService, provideMockStore({ initialState: initialAppState }), TestTypesService, TechnicalRecordService]
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

      component.newTestResult.subscribe(testResult => {
        expect(testResult).toEqual(expectedValue);
        done();
      });

      component.handleFormChange(event);
    });
  });
});
