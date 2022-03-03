import { TestBed, getTestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TechRecordHelperService } from './tech-record-helper.service';
import {
  VEHICLE_TYPES,
  RECORD_STATUS,
  RECORD_COMPLETENESS,
  RECORD_COMPLETENESS_skeleton
} from '@app/app.enums';

describe('TechRecordHelpersService', () => {
  let injector: TestBed;
  let service: TechRecordHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechRecordHelperService]
    }).compileComponents();

    injector = getTestBed();
    service = injector.get(TechRecordHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('VehicleTypes', () => {
    it('should return truthy if vehicle category is standard vehicle otherwise falsy', () => {
      expect(service.isStandardVehicle(VEHICLE_TYPES.PSV)).toBeTruthy();
      expect(service.isStandardVehicle(VEHICLE_TYPES.TRL)).toBeTruthy();
      expect(service.isStandardVehicle(VEHICLE_TYPES.HGV)).toBeTruthy();

      expect(service.isStandardVehicle(VEHICLE_TYPES.Moto)).toBeFalsy();
    });

    it('should return truthy if vehicle is HGV or TRL otherwise falsy', () => {
      expect(service.isHgvOrTrlVehicle(VEHICLE_TYPES.HGV)).toBeTruthy();
      expect(service.isHgvOrTrlVehicle(VEHICLE_TYPES.TRL)).toBeTruthy();

      expect(service.isHgvOrTrlVehicle(VEHICLE_TYPES.PSV)).toBeFalsy();
    });

    it('should return truthy if vehicle is PSV or TRL otherwise falsy', () => {
      expect(service.isPsvOrTrlVehicle(VEHICLE_TYPES.PSV)).toBeTruthy();
      expect(service.isPsvOrTrlVehicle(VEHICLE_TYPES.TRL)).toBeTruthy();

      expect(service.isPsvOrTrlVehicle(VEHICLE_TYPES.HGV)).toBeFalsy();
    });
  });

  describe('VehicleRecord', () => {
    it('should return truthy if record is an archived one', () => {
      expect(service.isArchivedRecord(RECORD_STATUS.ARCHIVED)).toBeTruthy();
    });
  });

  describe('setNumberOfAxles', () => {
    it('should set the number of axles', () => {
      const nextSpy: jasmine.Spy = spyOn(service._noOfAxles, 'next');
      service.setNumberOfAxles(4);

      expect(nextSpy).toHaveBeenCalledWith(4);
    });
  });

  describe('getNumberOfAxles', () => {
    it('should get number of axles as observable', () => {
      spyOn(service._noOfAxles, 'asObservable').and.returnValue(of(2));
      let result: number;
      service.getNumberOfAxles().subscribe((value) => (result = value));

      expect(result).toBe(2);
    });
  });

  describe('getCompletenessInfoByKey', () => {
    it('should return the specified string for the given key', () => {
      const completenessKey = RECORD_COMPLETENESS_skeleton;
      const displayString = service.getCompletenessInfoByKey(completenessKey);

      expect(displayString).toEqual(RECORD_COMPLETENESS[completenessKey]);
    });
  });
});
