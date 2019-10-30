import { ComponentsModule } from './components.module';
import {TestBed} from '@angular/core/testing';

describe('TechnicalRecordModule', () => {
  let componentsModule: ComponentsModule;

  beforeEach(() => {
    componentsModule = new ComponentsModule();
  });

  it('should create an instance', () => {
    expect(componentsModule).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
