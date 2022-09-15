import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockDefectList } from '@mocks/mock-defects';
import { mockTestResult } from '@mocks/mock-test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/.';
import { selectAmendedDefectData, selectedAmendedTestResultState } from '@store/test-records';
import { BaseTestRecordComponent } from '../../../components/base-test-record/base-test-record.component';
import { ResultOfTestComponent } from '../../../components/result-of-test/result-of-test.component';
import { AmendedTestRecordComponent } from './amended-test-record.component';

describe('AmendedTestRecordComponent', () => {
  let component: AmendedTestRecordComponent;
  let fixture: ComponentFixture<AmendedTestRecordComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmendedTestRecordComponent, BaseTestRecordComponent, ResultOfTestComponent],
      imports: [HttpClientTestingModule, SharedModule, DynamicFormsModule, TestResultsApiModule],
      providers: [TestRecordsService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectedAmendedTestResultState, mockTestResult());
    store.overrideSelector(selectAmendedDefectData, mockDefectList());

    fixture = TestBed.createComponent(AmendedTestRecordComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets class properties on component init', inject([TestRecordsService], (testRecordsService: TestRecordsService) => {
    const amendedTestResultSpy = jest.spyOn(testRecordsService, 'amendedTestResult$', 'get');
    const amendedDefectDataSpy = jest.spyOn(testRecordsService, 'amendedDefectData$', 'get');

    fixture.detectChanges();

    expect(amendedTestResultSpy).toHaveBeenCalled();
    expect(amendedDefectDataSpy).toHaveBeenCalled();
  }));
});
