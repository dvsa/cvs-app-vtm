import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestHistoryComponent } from './test-history.component';
import { SharedModule } from '@app/shared/shared.module';
import { VIEW_STATE } from '@app/app.enums';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';

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
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord();
    component.editState = VIEW_STATE.VIEW_ONLY;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
