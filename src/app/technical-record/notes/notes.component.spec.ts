import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TESTING_UTILS } from '@app/utils/testing.utils';
import { NotesComponent } from './notes.component';
import { SharedModule } from '@app/shared';

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
      vehicleType: 'hgv'
    });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should create view only for psv populated data', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      remarks: 'some remarks',
      vehicleType: 'psv'
    });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
