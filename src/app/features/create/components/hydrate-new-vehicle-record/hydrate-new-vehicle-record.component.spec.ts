import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HydrateNewVehicleRecordComponent } from './hydrate-new-vehicle-record.component';

describe('HydrateNewVehicleRecordComponent', () => {
  let component: HydrateNewVehicleRecordComponent;
  let fixture: ComponentFixture<HydrateNewVehicleRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HydrateNewVehicleRecordComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HydrateNewVehicleRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
