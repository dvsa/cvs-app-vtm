import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { of, ReplaySubject } from 'rxjs';

import { TyresSearchComponent } from './tyres-search.component';

const mockGlobalErrorService = {
  addError: jest.fn(),
  clearErrors: jest.fn()
};
const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn()
};
const mockReferenceDataService = {
  addSearchInformation: jest.fn(),
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
        { provide: DynamicFormService, useValue: mockDynamicFormService },
        { provide: GlobalErrorService, useValue: mockGlobalErrorService }
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
  it('should return roles', () => {
    const roles = component.roles;
    expect(roles).toBe(Roles);
  });
  it('should return errors', () => {
    const expectedError: GlobalError = { error: 'Error message', anchorLink: 'expected' };
    const expectedResult = component.getErrorByName([expectedError], expectedError.anchorLink!);
    expect(expectedResult).toBe(expectedError);
  });

  describe('handleSearch', () => {
    it('should set search results to an empty array before populating data', () => {
      component.handleSearch('', '');
      expect(component.searchResults).toStrictEqual([]);
    });
    it('should call add error in global error service when term is empty', () => {
      const filter = 'code';
      component.handleSearch('', filter);
      expect(mockGlobalErrorService.addError).toBeCalled();
    });
    it('should call add error in global error service when filter is empty', () => {
      const term = '103';
      component.handleSearch(term, '');
      expect(mockGlobalErrorService.addError).toBeCalled();
    });
    it('should call correct endpoint if filter === code', () => {
      const filter = 'code';
      const term = '103';
      component.handleSearch(filter, term);
      expect(mockReferenceDataService.loadReferenceDataByKeySearch).toBeCalledWith(ReferenceDataResourceType.Tyres, term);
    });
    it('should call correct endpoint if filter === plyrating', () => {
      const filter = 'plyrating';
      const term = '103';
      component.handleSearch(filter, term);
      expect(mockReferenceDataService.loadTyreReferenceDataByKeySearch).toBeCalledWith(filter, term);
    });
    it('should call correct endpoint if filter === singleload', () => {
      const filter = 'singleload';
      const term = '103';
      component.handleSearch(filter, term);
      expect(mockReferenceDataService.loadTyreReferenceDataByKeySearch).toBeCalledWith(filter, term);
    });
    it('should call correct endpoint if filter === doubleload', () => {
      const filter = 'doubleload';
      const term = '103';
      component.handleSearch(filter, term);
      expect(mockReferenceDataService.loadTyreReferenceDataByKeySearch).toBeCalledWith(filter, term);
    });
  });

  describe('handleSelectTyreData', () => {
    it('should have a truthy value for vehicle tech record', () => {
      const tyre: ReferenceDataTyre = {
        code: '103',
        loadIndexSingleLoad: '0',
        tyreSize: '0',
        dateTimeStamp: '0',
        userId: '0',
        loadIndexTwinLoad: '0',
        plyRating: '18',
        resourceType: ReferenceDataResourceType.Tyres,
        resourceKey: '103'
      };
      component.handleAddTyreToRecord(tyre);
      expect(mockTechRecordService.viewableTechRecord$).toBeTruthy();
    });
    it('should clear global errors', () => {
      const tyre: ReferenceDataTyre = {
        code: '103',
        loadIndexSingleLoad: '0',
        tyreSize: '0',
        dateTimeStamp: '0',
        userId: '0',
        loadIndexTwinLoad: '0',
        plyRating: '18',
        resourceType: ReferenceDataResourceType.Tyres,
        resourceKey: '103'
      };
      component.handleAddTyreToRecord(tyre);
      expect(mockGlobalErrorService.clearErrors).toBeCalled();
    });
  });

  describe('The cancel function', () => {
    it('should clear global errors', () => {
      component.cancel();
      expect(mockGlobalErrorService.clearErrors).toBeCalled();
    });
  });
});
