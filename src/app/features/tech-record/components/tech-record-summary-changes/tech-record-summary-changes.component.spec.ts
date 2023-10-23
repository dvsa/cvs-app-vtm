import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { TechRecordReasonForCreationSection } from '@forms/templates/general/reason-for-creation.template';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import {
  editingTechRecord,
  selectTechRecordChanges, selectTechRecordDeletions,
  techRecord,
} from '@store/technical-records';
import { of, ReplaySubject } from 'rxjs';
import { TechRecordSummaryChangesComponent } from './tech-record-summary-changes.component';

let actions$: ReplaySubject<Action>;
let store: MockStore;
describe('TechRecordSummaryChangesComponent', () => {
  let component: TechRecordSummaryChangesComponent;
  let fixture: ComponentFixture<TechRecordSummaryChangesComponent>;

  beforeEach(async () => {
    actions$ = new ReplaySubject<Action>();
    await TestBed.configureTestingModule({
      declarations: [TechRecordSummaryChangesComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        {
          provide: RouterService,
          useValue: {
            getRouteNestedParam$(param: string) {
              if (param === 'systemNumber') return of('123456');
              if (param === 'createdTimestamp') return of('123123123');
              return of('');
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TechRecordSummaryChangesComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateUponSuccess', () => {
    it('should handle state management', () => {
      jest.spyOn(component.actions$, 'pipe');
      component.navigateUponSuccess();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component.actions$.pipe).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should call navigateOnSuccess and initSubscriptions', () => {
      jest.spyOn(component, 'navigateUponSuccess');
      jest.spyOn(component, 'initSubscriptions');
    });
  });

  describe('initSubscriptions', () => {
    beforeEach(() => {
      jest.spyOn(store, 'select');
      component.ngOnInit();
    });
    it('should grab techRecord from the store', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(store.select).toHaveBeenCalledWith(techRecord);
    });
    it('should grab editingTechRecord from the store', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(store.select).toHaveBeenCalledWith(editingTechRecord);
    });
    it('should grab selectTechRecordChanges from the store', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(store.select).toHaveBeenCalledWith(selectTechRecordChanges);
    });
    it('should grab selectTechRecordDeletions from the store', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(store.select).toHaveBeenCalledWith(selectTechRecordDeletions);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call the destroy.next and destroy.complete', () => {
      jest.spyOn(component.destroy$, 'next');
      jest.spyOn(component.destroy$, 'complete');
      component.ngOnDestroy();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component.destroy$.next).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component.destroy$.complete).toHaveBeenCalled();
    });
  });

  describe('submit', () => {
    it('should dispatch updateTechRecords, clearAllSectionState and clearScrollPosition', () => {
      jest.spyOn(store, 'dispatch');
      component.submit();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(store.dispatch).toHaveBeenCalledTimes(3);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(store.dispatch).toHaveBeenCalledWith({
        systemNumber: '123456',
        createdTimestamp: '123123123',
        type: '[Technical Record Service] updateTechRecords',
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '[Technical Record Service] clearAllSectionState',
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '[Technical Record Service] clearScrollPosition',
      });
    });
  });

  describe('cancel', () => {
    it('should call globalErrorService.clearErrors and then navigate', () => {
      jest.spyOn(component.globalErrorService, 'clearErrors');
      jest.spyOn(component.router, 'navigate');
      component.cancel();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component.globalErrorService.clearErrors).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });

  describe('getTechRecordChangesKeys', () => {
    it('should return a list of all of the populated keys', () => {
      component.techRecordChanges = { techRecord_grossEecWeight: 1, techRecord_grossDesignWeight: 1 };
      const keys = component.getTechRecordChangesKeys();
      expect(keys).toEqual(['techRecord_grossEecWeight', 'techRecord_grossDesignWeight']);
    });
  });

  describe('getSectionsWhitelist', () => {
    it('should return an empty array if vehicleType is null', () => {
      component.techRecordEdited = undefined;
      const value = component.getSectionsWhitelist();
      expect(value).toEqual([]);
    });
    it('should return an empty array if techRecordChanges is null', () => {
      component.techRecord = undefined;
      const value = component.getSectionsWhitelist();
      expect(value).toEqual([]);
    });
    it('should call haveAxlesChanged if vehicleType and techRecordChanges are defined', () => {
      const localTechRecordEdited = getEmptyTechRecord();
      component.techRecordEdited = localTechRecordEdited as TechRecordType<'put'>;
      component.techRecordChanges = { techRecord_grossEecWeight: 1, techRecord_grossDesignWeight: 1 };
      const value = component.getSectionsWhitelist();
      expect(value).toEqual(['weightsSection']);
    });
  });

  describe('isNotEmpty', () => {
    it('should return true if an object is populated', () => {
      expect(component.isNotEmpty({ value: true })).toBe(true);
    });
    it('should return false if an object is not populated', () => {
      expect(component.isNotEmpty({})).toBe(false);
    });
  });

  describe('toVisibleFormNode', () => {
    it('updates the viewType property from hidden to string', () => {
      const children = TechRecordReasonForCreationSection.children!;
      const formNode = component.toVisibleFormNode(children[0]);
      expect(formNode.viewType).toEqual(FormNodeViewTypes.STRING);
    });
  });
});

function getEmptyTechRecord(): V3TechRecordModel {
  return {
    techRecord_createdAt: '',
    techRecord_createdById: null,
    techRecord_createdByName: null,
    techRecord_euVehicleCategory: null,
    techRecord_lastUpdatedAt: null,
    techRecord_lastUpdatedById: null,
    techRecord_lastUpdatedByName: null,
    techRecord_manufactureYear: null,
    techRecord_noOfAxles: 2,
    techRecord_notes: undefined,
    techRecord_applicantDetails_address1: null,
    techRecord_applicantDetails_address2: null,
    techRecord_applicantDetails_address3: null,
    techRecord_applicantDetails_emailAddress: null,
    techRecord_applicantDetails_name: null,
    techRecord_applicantDetails_postCode: null,
    techRecord_applicantDetails_postTown: null,
    techRecord_applicantDetails_telephoneNumber: null,
    techRecord_reasonForCreation: '',
    techRecord_regnDate: null,
    techRecord_statusCode: '',
    techRecord_vehicleConfiguration: 'other',
    techRecord_vehicleSubclass: undefined,
    techRecord_vehicleType: 'hgv',
  } as unknown as V3TechRecordModel;
}
