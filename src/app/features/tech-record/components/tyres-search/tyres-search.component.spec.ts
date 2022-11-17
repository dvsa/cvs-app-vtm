import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReferenceDataService } from '@api/reference-data';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { of, ReplaySubject } from 'rxjs';

import { TyresSearchComponent } from './tyres-search.component';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn()
};
const mockReferenceDataService = {
  getTyreSearchReturn$: jest.fn(),
  loadReferenceDataByKeySearch: jest.fn(),
  loadTyreReferenceDataByKeySearch: jest.fn(),
  loadReferenceData: jest.fn()
};
const mockDynamicFormService = {
  createForm: jest.fn()
};

describe('TyresSearchComponent', () => {
  let component: TyresSearchComponent;
  let fixture: ComponentFixture<TyresSearchComponent>;
  let actions$ = new ReplaySubject<Action>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TyresSearchComponent],
      imports: [RouterTestingModule, SharedModule, HttpClientTestingModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: ReferenceDataService, useValue: mockReferenceDataService },
        { provide: TechnicalRecordService, useValue: mockTechRecordService },
        { provide: DynamicFormService, useValue: mockDynamicFormService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TyresSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('', () => {
  //   it('', () => {
  //     expect('').toBe('');
  //   });
  //   it('', () => {
  //     expect('').toBe('');
  //   });
  // });

  // describe('', () => {
  //   it('', () => {
  //     expect('').toBe('');
  //   });
  //   it('', () => {
  //     expect('').toBe('');
  //   });
  // });
});
