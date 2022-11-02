import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { PsvBrakesComponent } from './psv-brakes.component';

describe('PsvBrakesComponent', () => {
  let component: PsvBrakesComponent;
  let fixture: ComponentFixture<PsvBrakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsvBrakesComponent ],
      imports: [DynamicFormsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule],
      providers: [MultiOptionsService, provideMockStore({ initialState: initialAppState })]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsvBrakesComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = mockVehicleTechnicalRecord().techRecord.pop()!;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
