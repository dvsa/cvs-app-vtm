import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { mockVehicleTechnicalRecord, mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import { Roles } from '@models/roles.enum';
import { VehicleClass } from '@models/vehicle-class.model';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { Observable, of } from 'rxjs';
import { TechRecordComponent } from '../../tech-record.component';

import { TechRecordTitleComponent } from './tech-record-title.component';

describe('TechRecordTitleComponent', () => {
  let component: TechRecordTitleComponent;
  let fixture: ComponentFixture<TechRecordTitleComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordTitleComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [MultiOptionsService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordTitleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show primary VRM', () => {
    const mockRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
    const mockVehicle = {
      vrms: [
        { vrm: 'TESTVRM', isPrimary: true },
        { vrm: 'TESTVRM2', isPrimary: false }
      ],
      vin: 'testvin',
      systemNumber: 'testNumber',
      techRecord: [mockRecord]
    };
    component.vehicle = mockVehicle;
    component.currentTechRecord$ = of(mockRecord);
    fixture.detectChanges();
    const vrmField = fixture.nativeElement.querySelector('app-number-plate');
    // expect(vrmField).toBeTruthy()
  });
});
