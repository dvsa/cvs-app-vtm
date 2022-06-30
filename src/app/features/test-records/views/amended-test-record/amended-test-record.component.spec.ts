import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { AmendedTestRecordComponent } from './amended-test-record.component';

describe('AmendedTestRecordComponent', () => {
  let component: AmendedTestRecordComponent;
  let fixture: ComponentFixture<AmendedTestRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmendedTestRecordComponent],
      imports: [HttpClientTestingModule, SharedModule, DynamicFormsModule, TestResultsApiModule],
      providers: [TestRecordsService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendedTestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
