import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TESTING_UTILS } from '@app/utils/testing.utils';
import { NotesComponent } from './notes.component';
import { SharedModule } from '@app/shared';
import { VEHICLE_TYPES } from '@app/app.enums';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [NotesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
  });

  it('should create view only for hgv and trl with populated data', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      notes: 'some notes',
      vehicleType: VEHICLE_TYPES.HGV
    });

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

  it('should create view only for motorcycle populated date', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      notes: 'some remarks',
      dispensations: '10/10',
      vehicleType: VEHICLE_TYPES.Moto
    });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
