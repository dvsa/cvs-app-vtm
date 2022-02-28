import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefectsComponent } from './defects.component';
import { SharedModule } from '@app/shared/shared.module';
import { Defect } from '@app/models/defect';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';
import { CustomDefect } from '@app/models/test.type';
import { TEST_TYPE_APPLICABLE_UTILS } from '@app/utils/test-type-applicable-models.utils';

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
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord();
    component.testTypesApplicable = TEST_TYPE_APPLICABLE_UTILS.mockTestTypesApplicable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should generate test type for test type doesn t have defects with deficiencyId & deficiencySubId', () => {
    const defects = [{ deficiencyId: null, deficiencySubId: null } as Defect];
    component.testType = TEST_MODEL_UTILS.mockTestType({ defects: defects });
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should generate test type for specialist tests', () => {
    component.testType = TEST_MODEL_UTILS.mockTestType({
      testTypeId: '125',
      customDefects: [{ defectNotes: 'test', defectName: 'test' } as CustomDefect]
    });
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
