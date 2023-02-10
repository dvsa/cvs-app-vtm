import { TestBed } from '@angular/core/testing';
import { AxlesService } from './axles.service';

describe('AxlesService', () => {
  let service: AxlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO
  describe('normaliseVehicleTechRecordAxles', () => {
    it('should not change anything if the tech record is correct', () => {
      const generateAxleSpacingSpy = jest.spyOn(service, 'generateAxleSpacing').mockImplementation();
      const generateAxlesFromAxleSpacingsSpy = jest.spyOn(service, 'generateAxlesFromAxleSpacings').mockImplementation();

      const [, newAxleSpacings] = service.normaliseAxles([{}, {}], [{}]);

      expect(generateAxleSpacingSpy).not.toHaveBeenCalled();
      expect(generateAxlesFromAxleSpacingsSpy).not.toHaveBeenCalled();
    });

    it('should call generate spacings if there are more axles', () => {
      const expectedResult = [{ axles: '1-2' }];

      const generateAxleSpacingSpy = jest.spyOn(service, 'generateAxleSpacing').mockImplementation(() => expectedResult);
      const generateAxlesFromAxleSpacingsSpy = jest.spyOn(service, 'generateAxlesFromAxleSpacings').mockImplementation();

      const [, newAxleSpacings] = service.normaliseAxles([{}, {}], []);

      expect(newAxleSpacings).toBe(expectedResult);
      expect(generateAxleSpacingSpy).toHaveBeenCalledWith(2, []);
      expect(generateAxlesFromAxleSpacingsSpy).not.toHaveBeenCalled();
    });

    it('should call generate axles if there are more spacings', () => {
      const expectedResult = [{ axleNumber: 1 }];

      const generateAxleSpacingSpy = jest.spyOn(service, 'generateAxleSpacing').mockImplementation();
      const generateAxlesFromAxleSpacingsSpy = jest.spyOn(service, 'generateAxlesFromAxleSpacings').mockImplementation(() => expectedResult);

      const [newAxles] = service.normaliseAxles([{}], [{}]);

      expect(newAxles).toBe(expectedResult);
      expect(generateAxleSpacingSpy).not.toHaveBeenCalled();
      expect(generateAxlesFromAxleSpacingsSpy).toHaveBeenCalledWith(1, [{}]);
    });
  });

  describe('generateAxleSpacing', () => {
    it('should generate 3 axle spacings', () => {
      const result = service.generateAxleSpacing(4);

      expect(result).toStrictEqual([
        { axles: '1-2', value: null },
        { axles: '2-3', value: null },
        { axles: '3-4', value: null }
      ]);
    });

    it('should generate no axle spacings', () => {
      const result = service.generateAxleSpacing(1);

      expect(result).toStrictEqual([]);
    });

    it('should generate 3 axle spacings when adding a axle', () => {
      const originalAxleSpacings = [
        { axles: '1-2', value: 100 },
        { axles: '2-3', value: 200 }
      ];

      const result = service.generateAxleSpacing(4, originalAxleSpacings);

      expect(result).toStrictEqual([
        { axles: '1-2', value: 100 },
        { axles: '2-3', value: 200 },
        { axles: '3-4', value: null }
      ]);
    });
  });

  describe('generateAxles', () => {
    it('should generate 3 axles from no previous data', () => {
      const result = service.generateAxlesFromAxleSpacings(2);

      expect(result.length).toBe(3);
      expect(result[0].axleNumber).toBe(1);
      expect(result[2].axleNumber).toBe(3);
    });

    it('should generate 3 axles from 1 previous axle', () => {
      const previousAxles = [{ axleNumber: 1 }];
      const result = service.generateAxlesFromAxleSpacings(2, previousAxles);

      expect(result.length).toBe(3);
      expect(result[0].axleNumber).toBe(1);
      expect(result[2].axleNumber).toBe(3);
    });
  });
});
