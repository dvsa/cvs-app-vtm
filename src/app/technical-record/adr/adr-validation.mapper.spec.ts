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

  describe('getVehicleTypeState', () => {
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
});
