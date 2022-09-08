import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { initialAppState } from '@store/.';
import { ReplaySubject } from 'rxjs';
import { CreateTestRecordComponent } from './create-test-record.component';
import { GetTestResultsService, UpdateTestResultsService, DefaultService as CreateTestResultsService } from '@api/test-results';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateTestRecordComponent', () => {
  let component: CreateTestRecordComponent;
  let fixture: ComponentFixture<CreateTestRecordComponent>;
  let actions$ = new ReplaySubject<Action>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTestRecordComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        GlobalErrorService,
        RouterService,
        TestRecordsService,
        GetTestResultsService,
        UpdateTestResultsService,
        CreateTestResultsService,
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$)
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
