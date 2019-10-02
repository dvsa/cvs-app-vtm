import { ComponentsModule } from './components.module';

describe('TechnicalRecordModule', () => {
  let componentsModule: ComponentsModule;

  beforeEach(() => {
    componentsModule = new ComponentsModule();
  });

  it('should create an instance', () => {
    expect(componentsModule).toBeTruthy();
  });
});
