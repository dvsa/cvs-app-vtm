import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockDefectList } from '@mocks/mock-defects';
import { mockTestResult } from '@mocks/mock-test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { selectAmendedDefectData, selectedAmendedTestResultState } from '@store/test-records';
import { AmendedTestRecordComponent } from './amended-test-record.component';

describe('AmendedTestRecordComponent', () => {
  let component: AmendedTestRecordComponent;
  let fixture: ComponentFixture<AmendedTestRecordComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmendedTestRecordComponent],
      imports: [HttpClientTestingModule, SharedModule, DynamicFormsModule],
      providers: [TestRecordsService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectedAmendedTestResultState, mockTestResult());
    store.overrideSelector(selectAmendedDefectData, mockDefectList());

    fixture = TestBed.createComponent(AmendedTestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
