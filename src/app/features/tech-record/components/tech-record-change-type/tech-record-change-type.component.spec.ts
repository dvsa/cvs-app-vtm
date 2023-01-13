import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of, ReplaySubject } from 'rxjs';
import { ChangeVehicleTypeComponent } from './tech-record-change-type.component';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn()
};

const mockDynamicFormService = {
  createForm: jest.fn()
};

let router: Router;
let store: MockStore;

describe('TechRecordChangeTypeComponent', () => {
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
      ],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVehicleTypeComponent);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
