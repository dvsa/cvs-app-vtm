import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefectsComponent } from './defects.component';
import { SharedModule } from '@app/shared/shared.module';
import { TEST_MODEL_UTILS } from '@app/utils/test-models.utils';
import { Defect } from '@app/models/defect';

describe('DefectsComponent', () => {
  let component: DefectsComponent;
  let fixture: ComponentFixture<DefectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [DefectsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectsComponent);
    component = fixture.componentInstance;
    const defects = [{ deficiencyId: '123', deficiencySubId: '345' } as Defect];
    component.testType = TEST_MODEL_UTILS.mockTestType({ defects: defects });
    component.testRecord = TEST_MODEL_UTILS.mockTestResult();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should match snapshot if test type doesn t have defects with deficiencyId & deficiencySubId', () => {
    const defects = [{ deficiencyId: null, deficiencySubId: null } as Defect];
    component.testType = TEST_MODEL_UTILS.mockTestType({ defects: defects });
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
