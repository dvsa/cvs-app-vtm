import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Defect } from '@models/defects/defect.model';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { DefectComponent } from './defect.component';

describe('DefectComponent', () => {
  let component: DefectComponent;
  let fixture: ComponentFixture<DefectComponent>;
  let router: Router;

  const deficiency: Deficiency = {
    deficiencyCategory: deficiencyCategory.Major,
    deficiencyId: 'a',
    deficiencySubId: '',
    deficiencyText: 'missing.',
    forVehicleType: [VehicleTypes.PSV],
    ref: '1.1.a',
    stdForProhibition: false
  };

  const item: Item = {
    deficiencies: [deficiency],
    forVehicleType: [VehicleTypes.PSV],
    itemDescription: 'A registration plate:',
    itemNumber: 1
  };

  const defect: Defect = {
    additionalInfo: {
      [VehicleTypes.PSV]: {
        location: {
          longitudinal: ['front', 'rear']
        },
        notes: true
      }
    },
    forVehicleType: [VehicleTypes.PSV],
    imDescription: 'Registration Plate',
    imNumber: 1,
    items: [item]
  };

  const fakeActivatedRoute = {
    snapshot: { data: { key: 'value' } }
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, DynamicFormsModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to test record', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    component.navigateBack();
    expect(navigateSpy).toHaveBeenCalled();
  });

  describe('should initialize info Dictionary', () => {
    it('should initialize notes to true', () => {
      component.vehicleType = VehicleTypes.PSV;

      component.initializeInfoDictionary(defect);
      expect(component.includeNotes).toEqual(true);
    });

    it('should initialize info dictionary to the longitude', () => {
      component.vehicleType = VehicleTypes.PSV;

      component.initializeInfoDictionary(defect);
      expect(component.infoDictionary).toEqual({
        longitudinal: [
          {
            label: 'Front',
            value: 'front'
          },
          {
            label: 'Rear',
            value: 'rear'
          }
        ]
      });
    });
  });
});
