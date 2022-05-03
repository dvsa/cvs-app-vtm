import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { mockTestResult } from '@mocks/mock-test-result';
import { TestRecordComponent } from './test-records.component';
import { SharedModule } from '@shared/shared.module';
import { formatDate } from '@angular/common';
import { DynamicFormsModule } from '../../../../forms/dynamic-forms.module';

describe('TestRecordComponent', () => {
  let component: TestRecordComponent;
  let fixture: ComponentFixture<TestRecordComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestRecordComponent],
      imports: [HttpClientTestingModule, SharedModule, DynamicFormsModule],
      providers: [TestRecordsService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRecordComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything when there is no data', fakeAsync(() => {
    component.testResult$ = of(undefined);
    tick();
    fixture.detectChanges();
    expect(el.query(By.css('h1'))).toBeNull();
  }));
});
