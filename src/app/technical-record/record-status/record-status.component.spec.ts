import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordStatusComponent } from './record-status.component';
import { TechRecord } from '@app/models/tech-record.model';
import { RECORD_STATUS, RECORD_COMPLETENESS, RECORD_COMPLETENESS_skeleton } from '@app/app.enums';
import { TechRecordHelperService } from '../tech-record-helper.service';

describe('RecordStatusComponent', () => {
  let component: TestRecordStatusComponent;
  let fixture: ComponentFixture<TestRecordStatusComponent>;
  let techRecHelper: TechRecordHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RecordStatusComponent,
        TestRecordStatusComponent,
        TestRecordStatusEditComponent
      ],
      providers: [TechRecordHelperService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    techRecHelper = TestBed.get(TechRecordHelperService);
    fixture = TestBed.createComponent(TestRecordStatusComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      statusCode: RECORD_STATUS.CURRENT,
      recordCompleteness: RECORD_COMPLETENESS_skeleton
    } as TechRecord;
    component.editState = false;
  });

  it('should create view only with populated data', () => {
    jest
      .spyOn(techRecHelper, 'getCompletenessInfoByKey')
      .mockReturnValue(RECORD_COMPLETENESS[RECORD_COMPLETENESS_skeleton]);
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(techRecHelper.getCompletenessInfoByKey).toHaveBeenCalledWith(
      RECORD_COMPLETENESS_skeleton
    );
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if editState is true', () => {
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-vtm-record-status',
  template: `
    <vtm-record-status [activeRecord]="activeRecord" [editState]="editState"> </vtm-record-status>
  `
})
class TestRecordStatusComponent {
  activeRecord: TechRecord;
  editState: boolean;
}

@Component({
  selector: 'vtm-record-status-edit',
  template: `
    <div>active record {{ techRecord | json }}</div>
  `
})
class TestRecordStatusEditComponent {
  @Input() techRecord: TechRecord;
}
