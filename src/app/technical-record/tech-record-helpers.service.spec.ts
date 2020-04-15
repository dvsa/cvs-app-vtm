import { TestBed, getTestBed } from '@angular/core/testing';
import { TechRecordHelpersService } from './tech-record-helpers.service';

describe('TechRecordHelpersService', () => {
  let injector: TestBed;
  let service: TechRecordHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechRecordHelpersService]
    }).compileComponents();

    injector = getTestBed();
    service = injector.get(TechRecordHelpersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isStandardVehicle', () => {
    it('should return true if vehicle type is a standard one(psv)', () => {
      expect(service.isStandardVehicle('psv')).toBe(true);
    });

    it('should return true if vehicle type is a standard one(trl)', () => {
      expect(service.isStandardVehicle('trl')).toBe(true);
    });

    it('should return false if vehicle type is a motorcycle', () => {
      expect(service.isStandardVehicle('motorcycle')).toBe(false);
    });
  });
});
