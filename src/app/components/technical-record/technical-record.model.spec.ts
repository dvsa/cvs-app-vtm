import {TechnicalRecordModel, Axle} from './technical-record.model';

describe('Technical Record Model', () => {

  it('should create TechRecordModel and AxleModel', () => {
    const techRecModel = new TechnicalRecordModel();
    const axle = new Axle();
    expect(techRecModel).toBeDefined();
    expect(axle).toBeDefined();
  });
});
