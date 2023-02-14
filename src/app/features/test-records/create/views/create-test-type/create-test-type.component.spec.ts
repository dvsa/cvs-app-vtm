import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestType } from '@api/test-types';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { TestTypeSelectComponent } from '../../../components/test-type-select/test-type-select.component';
import { CreateTestTypeComponent } from './create-test-type.component';

describe('CreateTestTypeComponent', () => {
  let component: CreateTestTypeComponent;
  let fixture: ComponentFixture<CreateTestTypeComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let techRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTestTypeComponent, TestTypeSelectComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        {
          provide: TechnicalRecordService
        },
        { provide: TestTypesService, useValue: { selectAllTestTypes$: of([]), testTypeIdChanged: () => {} } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestTypeComponent);
    techRecordService = TestBed.inject(TechnicalRecordService);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    jest.spyOn(window, 'alert').mockImplementation();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to sibling path "amend-test-details"', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
    component.handleSelectedTestType({ id: '1' } as TestType);
    expect(navigateSpy).toHaveBeenCalledWith(['..', 'test-details'], {
      queryParams: { testType: '1' },
      queryParamsHandling: 'merge',
      relativeTo: route
    });
  });

  describe('AfterContentInit', () => {
    const testCases = [
      {
        record: { recordCompleness: 'foo' },
        message:
          'Incomplete vehicle record.\n\n' +
          'This vehicle does not have enough data to be tested. ' +
          'Call Technical Support to correct this record and use SAR to test this vehicle.'
      },
      {
        record: { hiddenInVta: true },
        message: 'Vehicle record is hidden in VTA.\n\nShow the vehicle record in VTA to start recording tests against it.'
      }
    ];

    it.each(testCases)('should get the vehicle record and alert with the appropriate message', ({ record, message }) => {
      jest.resetAllMocks();
      const mockVehicleRecordSpy = jest
        .spyOn(techRecordService, 'selectedVehicleTechRecord$', 'get')
        .mockReturnValue(of({ vin: 'foo' } as VehicleTechRecordModel));
      const mockTechRecordSpy = jest.spyOn(techRecordService, 'viewableTechRecord$').mockReturnValue(of(record as TechRecordModel));
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
      const navigateSpy = jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
      component.ngAfterContentInit();
      expect(mockVehicleRecordSpy).toHaveBeenCalledTimes(1);
      expect(mockTechRecordSpy).toHaveBeenCalledTimes(1);
      expect(mockTechRecordSpy).toHaveBeenCalledWith({ vin: 'foo' });
      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith(message);
      expect(navigateSpy).toHaveBeenCalledWith(['../../..'], { relativeTo: route });
    });
  });
});
