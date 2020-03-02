import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleComponent } from './vehicle.component';
import { TestResultModel } from '@app/models/test-result.model';
import { SharedModule } from '@app/shared/shared.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('VehicleComponent', () => {
  let component: VehicleComponent;
  let fixture: ComponentFixture<VehicleComponent>;
  const testRecord = {} as TestResultModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [VehicleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleComponent);
    component = fixture.componentInstance;
    component.testRecord = testRecord;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
