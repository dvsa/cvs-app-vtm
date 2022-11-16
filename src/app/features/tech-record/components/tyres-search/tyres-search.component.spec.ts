import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReferenceDataService } from '@api/reference-data';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { createMockPsv } from '@mocks/psv-record.mock';
import { Tyres } from '@models/vehicle-tech-record.model';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { initialAppState, State } from '@store/index';

import { TyresSearchComponent } from './tyres-search.component';

const mockReferenceDataService = {
  getTyreSearchReturn$: jest.fn(),
  loadReferenceDataByKeySearch: jest.fn(),
  loadTyreReferenceDataByKeySearch: jest.fn()
};

const mockTechnicalRecordService = {
  selectedVehicleTechRecord$: jest.fn(),
  editableTechRecord$: jest.fn()
};

describe('TyresSearchComponent', () => {
  let component: TyresSearchComponent;
  let fixture: ComponentFixture<TyresSearchComponent>;
  let route: ActivatedRoute;

  // let spy: jest.SpyInstance<void, [tyre: Tyres, axleNumber: number]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, DynamicFormsModule, StoreModule.forRoot({})],
      declarations: [TyresSearchComponent, DefaultNullOrEmpty],
      providers: [
        provideMockStore<State>({ initialState: initialAppState }),
        { provide: ReferenceDataService, useValue: mockReferenceDataService },
        Actions
        //{ provide: TechnicalRecordService, useValue: mockTechnicalRecordService }
      ]
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TyresSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // spy = jest.spyOn(component, '');
  });

  it('should create', () => {
    console.log(component);
    //expect(component).toBeTruthy();
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
