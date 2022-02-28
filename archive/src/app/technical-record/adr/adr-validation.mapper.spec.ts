import { TestBed } from '@angular/core/testing';

import { ValidationMapper, STATUS, ValidationState } from './adr-validation.mapper';
import { of } from 'rxjs';

const batteryType = 'semi trailer battery';
const tankType = 'semi trailer tank';
const noneType = 'full drawbar skeletal';

describe('ValidationMapper', () => {
  let validationMapper: ValidationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationMapper]
    });

    validationMapper = TestBed.get(ValidationMapper);
  });

  describe('vehicleTypeSelected', () => {
    let nextSpy: jasmine.Spy;
    beforeEach(() => {
      nextSpy = spyOn(validationMapper._state, 'next');
    });

    it('should emit battery validation status if vehicle type has battery', () => {
      validationMapper.vehicleTypeSelected(batteryType);

      expect(nextSpy).toHaveBeenCalledWith({ tankDetailsEdit: STATUS.MANDATORY });
    });

    it('should emit tank validation status if vehicle type has tank', () => {
      validationMapper.vehicleTypeSelected(tankType);

      expect(nextSpy).toHaveBeenCalledWith({
        tankDetailsEdit: 'MANDATORY',
        batteryListApplicableEdit: 'HIDDEN'
      });
    });

    it('should emit none validation status if vehicle type has no battery or tank', () => {
      validationMapper.vehicleTypeSelected(noneType);

      expect(nextSpy).toHaveBeenCalledWith({
        tankDetailsEdit: STATUS.HIDDEN,
        tankDocuments: STATUS.HIDDEN,
        tankInspectionsEdit: STATUS.HIDDEN,
        memoEdit: STATUS.HIDDEN,
        batteryListApplicableEdit: STATUS.HIDDEN
      });
    });
  });

  describe('getCurrentState', () => {
    it('should get the validation state as observable', () => {
      spyOn(validationMapper._state, 'asObservable').and.returnValue(
        of({ tankDetailsEdit: STATUS.MANDATORY })
      );
      let result: ValidationState;
      validationMapper.getCurrentState().subscribe((value) => (result = value));

      expect(result).toEqual({ tankDetailsEdit: STATUS.MANDATORY });
    });
  });
});
