import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestType } from '@api/test-types';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTestTypeComponent, TestTypeSelectComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        {
          provide: TechnicalRecordService,
          useValue: {
            selectedVehicleTechRecord$: of(mockVehicleTechnicalRecord())
          }
        },
        { provide: TestTypesService, useValue: { selectAllTestTypes$: of([]), testTypeIdChanged: () => {} } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestTypeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
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
});
