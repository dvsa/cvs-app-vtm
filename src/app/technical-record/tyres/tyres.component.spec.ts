import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TESTING_UTILS } from '../../utils/testing.utils';
import { TyresComponent } from './tyres.component';
import { Axle } from '../../models/tech-record.model';

describe('TyresComponent', () => {
  let component: TyresComponent;
  let fixture: ComponentFixture<TyresComponent>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TyresComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TyresComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    const axles: Axle[] = [TESTING_UTILS.mockAxle()];
    component.activeRecord = TESTING_UTILS.mockTechRecord({ axles });
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create psv view only with populated data', () => {
    component.activeRecord.vehicleType = 'psv';
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
