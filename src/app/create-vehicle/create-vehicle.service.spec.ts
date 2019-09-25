import { TestBed, inject } from '@angular/core/testing';
import { MaterialModule } from "../material.module";
import { CreateVehicleService } from './create-vehicle.service';

describe('CreateVehicleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateVehicleService],
      imports: [MaterialModule]
    });
  });

  it('should be created', inject([CreateVehicleService], (service: CreateVehicleService) => {
    expect(service).toBeTruthy();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
