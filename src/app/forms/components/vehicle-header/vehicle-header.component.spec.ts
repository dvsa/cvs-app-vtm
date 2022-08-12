import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { SharedModule } from '@shared/shared.module';

import { VehicleHeaderComponent } from './vehicle-header.component';

describe('VehicleHeaderComponent', () => {
  let component: VehicleHeaderComponent;
  let fixture: ComponentFixture<VehicleHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleHeaderComponent],
      imports: [SharedModule],
      providers: [DynamicFormService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
