import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { Roles } from '@models/roles.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/index';
import { editableTechRecord } from '@store/technical-records';
import { Observable, of } from 'rxjs';
import { TechRecordTitleComponent } from './tech-record-title.component';

const MockUserService = {
  getUserName$: jest.fn().mockReturnValue(new Observable()),
  roles$: of([Roles.TestResultAmend, Roles.TestResultView])
};

describe('TechRecordTitleComponent', () => {
  let component: TechRecordTitleComponent;
  let fixture: ComponentFixture<TechRecordTitleComponent>;
  let store: MockStore<State>;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordTitleComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [provideMockStore({ initialState: initialAppState }), { provide: UserService, useValue: MockUserService }, TechnicalRecordService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordTitleComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    technicalRecordService = TestBed.inject(TechnicalRecordService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('the VRM fields', () => {
    it('should show primary VRM', () => {
      const mockRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      const viewableTechRecordSpy = jest.spyOn(technicalRecordService, 'viewableTechRecord$').mockReturnValue(of(mockRecord));
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
      store.overrideSelector(editableTechRecord, mockRecord);
      fixture.detectChanges();

      const vrmField = fixture.debugElement.query(By.css('#current-vrm-span')).nativeElement;
      expect(vrmField.textContent).toContain('TEST VRM');
    });

    it('should show the newest (last) secondary VRM', () => {
      const mockRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      const viewableTechRecordSpy = jest.spyOn(technicalRecordService, 'viewableTechRecord$').mockReturnValue(of(mockRecord));
      const mockVehicle = {
        vrms: [
          { vrm: 'TESTVRM6', isPrimary: true },
          { vrm: 'TESTVRM', isPrimary: false },
          { vrm: 'TESTVRM2', isPrimary: false },
          { vrm: 'TESTVRM3', isPrimary: false },
          { vrm: 'TESTVRM4', isPrimary: false },
          { vrm: 'TESTVRM5', isPrimary: false }
        ],
        vin: 'testvin',
        systemNumber: 'testNumber',
        techRecord: [mockRecord]
      };
      component.vehicle = mockVehicle;
      store.overrideSelector(editableTechRecord, mockRecord);
      fixture.detectChanges();

      const vrmField = fixture.debugElement.query(By.css('#previous-vrm-span')).nativeElement;
      expect(vrmField.textContent).toContain('TESTV RM5');
      expect(vrmField.textContent).not.toContain('TEST VRM');
      expect(vrmField.textContent).not.toContain('TESTV RM2');
      expect(vrmField.textContent).not.toContain('TESTV RM3');
      expect(vrmField.textContent).not.toContain('TESTV RM4');
    });
    it('should not create previous-vrm-span if no secondary vrm exists', () => {
      const mockRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      const viewableTechRecordSpy = jest.spyOn(technicalRecordService, 'viewableTechRecord$').mockReturnValue(of(mockRecord));
      const mockVehicle = {
        vrms: [{ vrm: 'TESTVRM', isPrimary: true }],
        vin: 'testvin',
        systemNumber: 'testNumber',
        techRecord: [mockRecord]
      };
      component.vehicle = mockVehicle;
      store.overrideSelector(editableTechRecord, mockRecord);
      fixture.detectChanges();

      const vrmField = fixture.debugElement.query(By.css('#previous-vrm-span'));
      expect(vrmField).toBe(null);
    });
  });
});
