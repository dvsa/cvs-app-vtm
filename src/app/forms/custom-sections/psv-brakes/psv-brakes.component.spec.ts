import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { PsvBrakesComponent } from './psv-brakes.component';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';

describe('PsvBrakesComponent', () => {
  let component: PsvBrakesComponent;
  let fixture: ComponentFixture<PsvBrakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PsvBrakesComponent],
      imports: [DynamicFormsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        MultiOptionsService,
        provideMockStore({ initialState: initialAppState }),
        ReferenceDataService,
        { provide: UserService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsvBrakesComponent);
    component = fixture.componentInstance;
    //TODO V3 This is for PSV
    component.vehicleTechRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
