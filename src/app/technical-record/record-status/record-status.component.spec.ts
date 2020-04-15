import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordStatusComponent } from './record-status.component';
import { TechRecord } from '@app/models/tech-record.model';
import { RECORD_STATUS } from '@app/app.enums';

describe('RecordStatusComponent', () => {
  let component: RecordStatusComponent;
  let fixture: ComponentFixture<RecordStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecordStatusComponent, TestRecordStatusEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordStatusComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      statusCode: RECORD_STATUS.CURRENT,
      recordCompleteness: 'complete'
    } as TechRecord;
  });

  it('should create view only with populated data', () => {
    component.editState = false;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if editState is true', () => {
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-record-status-edit',
  template: `
    <div>active record {{ techRecord | json }}</div>
  `
})
class TestRecordStatusEditComponent {
  @Input() techRecord: TechRecord;
}
