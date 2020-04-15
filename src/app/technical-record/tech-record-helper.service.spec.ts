import { TestBed, getTestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TechRecordHelperService } from './tech-record-helper.service';
import { VEHICLE_TYPES } from '@app/app.enums';

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

  describe('isStandardVehicle', () => {
    it('should return truthty if vehicle category is standard vehicle', () => {
      expect(service.isStandardVehicle(VEHICLE_TYPES.PSV)).toBeTruthy();
      expect(service.isStandardVehicle(VEHICLE_TYPES.TRL)).toBeTruthy();
      expect(service.isStandardVehicle(VEHICLE_TYPES.HGV)).toBeTruthy();
    });

    it('should return falsy if vehicle category is not standard vehicle', () => {
      expect(service.isStandardVehicle(VEHICLE_TYPES.Moto)).toBeFalsy();
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
});
