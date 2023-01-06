import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechRecord } from '@api/vehicle';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of, ReplaySubject } from 'rxjs';
import { TechRecordsModule } from '../../tech-record.module';

import { ChangeVehicleTypeComponent } from './change-vehicle-type.component';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn()
};

const mockDynamicFormService = {
  createForm: jest.fn()
};

describe('ChangeVehicleTypeComponent', () => {
  let component: ChangeVehicleTypeComponent;
  let fixture: ComponentFixture<ChangeVehicleTypeComponent>;
  let actions$ = new ReplaySubject<Action>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeVehicleTypeComponent],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),

        { provide: TechnicalRecordService, useValue: mockTechRecordService },
        { provide: DynamicFormService, useValue: mockDynamicFormService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVehicleTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return a technical record', () => {
    const techRecord = component.vehicleTechRecord;
    expect(techRecord).toBeTruthy();
  });
});
