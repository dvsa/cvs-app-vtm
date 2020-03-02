import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitEditComponent } from './visit-edit.component';
import { CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultModel } from '@app/models/test-result.model';
import { TestStation } from '@app/models/test-station';
import {TESTING_UTILS} from '@app/utils/testing.utils';

describe('VisitEditComponent', () => {
  let component: VisitEditComponent;
  let fixture: ComponentFixture<VisitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisitEditComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitEditComponent);
    component = fixture.componentInstance;
    component.testRecord = {} as TestResultModel;
    component.testStations = [{ testStationEmails: ['test'] } as TestStation];
    component.testStationsOptions = ['test'];
    component.testerEmailAddresses = ['test'];
    component.testerEmail = 'test';
    component.testStationType = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
