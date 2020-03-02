import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TestHistoryComponent} from './test-history.component';
import {SharedModule} from '@app/shared/shared.module';
import {TestResultModel} from '@app/models/test-result.model';
import {VIEW_STATE} from '@app/app.enums';

describe('TestHistoryComponent', () => {
  let component: TestHistoryComponent;
  let fixture: ComponentFixture<TestHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TestHistoryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHistoryComponent);
    component = fixture.componentInstance;
    component.testRecord = {} as TestResultModel;
    component.editState = VIEW_STATE.VIEW_ONLY;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
