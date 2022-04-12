import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { initialAppState } from '@store/.';
import { TestRecordComponent } from './test-records.component';

describe('TestRecordComponent', () => {
  let component: TestRecordComponent;
  let fixture: ComponentFixture<TestRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestRecordComponent],
      imports: [HttpClientTestingModule],
      providers: [TestRecordsService, provideMockStore({initialState: initialAppState})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
