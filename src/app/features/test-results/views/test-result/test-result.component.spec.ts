import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TestResultsService } from '@services/test-results/test-results.service';
import { initialAppState } from '@store/.';
import { TestResultComponent } from './test-result.component';

describe('TestResultComponent', () => {
  let component: TestResultComponent;
  let fixture: ComponentFixture<TestResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestResultComponent],
      imports: [HttpClientTestingModule],
      providers: [TestResultsService, provideMockStore({initialState: initialAppState})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
