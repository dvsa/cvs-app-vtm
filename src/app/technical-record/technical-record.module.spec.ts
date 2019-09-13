import { TechnicalRecordModule } from './technical-record.module';

describe('TechnicalRecordModule', () => {
  let technicalRecordModule: TechnicalRecordModule;

  beforeEach(() => {
    technicalRecordModule = new TechnicalRecordModule();
  });

  it('should create an instance', () => {
    expect(technicalRecordModule).toBeTruthy();
  });
});
