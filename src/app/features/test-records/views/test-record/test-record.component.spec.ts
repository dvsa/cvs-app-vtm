import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { TestRecordComponent } from './test-record.component';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '../../../../forms/dynamic-forms.module';
import { selectDefectData, selectedTestResultState } from '@store/test-records';
import { mockTestResult } from '@mocks/mock-test-result';
import { mockDefectList } from '@mocks/mock-defects';
import { TestAmendmentHistoryComponent } from '../../components/test-amendment-history/test-amendment-history.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TestRecordComponent', () => {
  let component: TestRecordComponent;
  let fixture: ComponentFixture<TestRecordComponent>;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestAmendmentHistoryComponent, TestRecordComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [TestRecordsService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectedTestResultState, mockTestResult());
    store.overrideSelector(selectDefectData, mockDefectList());

    fixture = TestBed.createComponent(TestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything when there is no data', fakeAsync(() => {
    component.testResult$ = of(undefined);
    tick();
    expect(fixture.debugElement.query(By.css('h1'))).toBeNull();
  }));
});
