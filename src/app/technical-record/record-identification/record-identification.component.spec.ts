import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { RecordIdentificationComponent } from './record-identification.component';
import { VehicleTechRecordEdit } from '@app/models/vehicle-tech-record.model';

describe('RecordIdentificationComponent', () => {
  let component: RecordIdentificationComponent;
  let fixture: ComponentFixture<RecordIdentificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [RecordIdentificationComponent, TestRecordIdentificationEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordIdentificationComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = {
      vin: 'ABCDEFGH654321',
      primaryVrm: 'LKJH654',
      secondaryVrms: ['AAJH654', 'LKJHBBB']
    } as VehicleTechRecordEdit;
  });

  it('should create view only with populated data', () => {
    component.editState = false;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create view only with trailer Id data', () => {
    component.vehicleTechRecord.trailerId = '0285678';
    component.editState = false;
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
  selector: 'vtm-record-identification-edit',
  template: `
    <div>Vin is {{ vin }}</div>
    <div>Primary Vrm is {{ primaryVrm }}</div>
  `
})
class TestRecordIdentificationEditComponent {
  @Input() vin: string;
  @Input() primaryVrm: string;
}
