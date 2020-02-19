import { TestBed } from '@angular/core/testing';
import { ValidationMapper, STATUS } from './adr-validation.mapper';

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

  describe('mapVehicleTypeToValidationState', () => {
    it('should emit battery validation status if vehicle type has battery', () => {
      const nextSpy = spyOn(validationMapper.state, 'next');
      validationMapper.mapVehicleTypeToValidationState(batteryType);

      expect(nextSpy).toHaveBeenCalledWith({ tankDetailsEdit: STATUS.MANDATORY });
    });

    it('should emit tank validation status if vehicle type has tank', () => {
      const nextSpy = spyOn(validationMapper.state, 'next');
      validationMapper.mapVehicleTypeToValidationState(tankType);

      expect(nextSpy).toHaveBeenCalledWith({
        tankDetailsEdit: 'MANDATORY',
        batteryListApplicableEdit: 'HIDDEN'
      });
    });

    it('should emit none validation status if vehicle type has no battery or tank', () => {
      const nextSpy = spyOn(validationMapper.state, 'next');
      validationMapper.mapVehicleTypeToValidationState(noneType);

      expect(nextSpy).toHaveBeenCalledWith({
        tankDetailsEdit: STATUS.HIDDEN,
        tankDocuments: STATUS.HIDDEN,
        tankInspectionsEdit: STATUS.HIDDEN,
        memoEdit: STATUS.HIDDEN,
        batteryListApplicableEdit: STATUS.HIDDEN
      });
    });
  });
});
