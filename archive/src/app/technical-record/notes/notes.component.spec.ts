import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Input, Component } from '@angular/core';

import { TESTING_UTILS } from '@app/utils/testing.utils';
import { NotesComponent } from './notes.component';
import { SharedModule } from '@app/shared';
import { VEHICLE_TYPES } from '@app/app.enums';
import { TechRecord } from '@app/models/tech-record.model';

describe('NotesComponent', () => {
  let fixture: ComponentFixture<TestNotesComponent>;
  let component: TestNotesComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [NotesComponent, TestNotesComponent, TestNotesEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestNotesComponent);
    component = fixture.componentInstance;
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      notes: 'some notes',
      vehicleType: VEHICLE_TYPES.HGV
    });
  });

  it('should create view only for hgv or trl with populated data', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should create view only for psv populated data', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      remarks: 'some remarks',
      dispensations: '10/10',
      vehicleType: VEHICLE_TYPES.PSV
    });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should create view only for motorcycle populated data', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      notes: 'some remarks',
      dispensations: '10/10',
      vehicleType: VEHICLE_TYPES.Moto
    });
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if editState is true', () => {
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-vtm-notes',
  template: `
    <vtm-notes [techRecord]="activeRecord" [editState]="editState"> </vtm-notes>
  `
})
class TestNotesComponent {
  activeRecord: TechRecord;
  editState: boolean;
}

@Component({
  selector: 'vtm-notes-edit',
  template: `
    <div>Note details: {{ notesDetails }}</div>
  `
})
class TestNotesEditComponent {
  @Input() notesDetails: string;
}
