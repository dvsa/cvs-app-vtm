import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/iva/defects/enums/euVehicleCategory.enum.js';
import { RequiredStandard, SectionIVA } from '@dvsa/cvs-type-definitions/types/iva/defects/get';
import { INSPECTION_TYPE } from '@models/test-results/test-result-required-standard.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { RequiredStandardSelectComponent } from './required-standard-select.component';

describe('RequiredStandardSelectComponent', () => {
  let component: RequiredStandardSelectComponent;
  let fixture: ComponentFixture<RequiredStandardSelectComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RequiredStandardSelectComponent],
      providers: [provideMockStore({ initialState: initialAppState })],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredStandardSelectComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleSelectBasicOrNormal', () => {
    it('should work for basic inspection', () => {
      component.basicAndNormalRequiredStandards = {
        basic: ['basic' as unknown as SectionIVA, 'basic1' as unknown as SectionIVA],
        normal: ['normal' as unknown as SectionIVA, 'normal1' as unknown as SectionIVA],
        euVehicleCategories: [EUVehicleCategory.M1],
      };

      component.handleSelectBasicOrNormal(INSPECTION_TYPE.BASIC);

      expect(component.requiredStandards).toStrictEqual(['basic', 'basic1']);
    });
    it('should work for normal inspection', () => {
      component.basicAndNormalRequiredStandards = {
        basic: ['basic' as unknown as SectionIVA, 'basic1' as unknown as SectionIVA],
        normal: ['normal' as unknown as SectionIVA, 'normal1' as unknown as SectionIVA],
        euVehicleCategories: [EUVehicleCategory.M1],
      };

      component.handleSelectBasicOrNormal(INSPECTION_TYPE.NORMAL);

      expect(component.requiredStandards).toStrictEqual(['normal', 'normal1']);
    });
  });

  describe('handleSelect', () => {
    it('should handle when I pick an inspection type', () => {
      const spy = jest.spyOn(component, 'handleSelectBasicOrNormal');

      component.handleSelect(INSPECTION_TYPE.BASIC, Types.InspectionType);

      expect(spy).toHaveBeenCalled();
      expect(component.selectedInspectionType).toBe(INSPECTION_TYPE.BASIC);
      expect(component.selectedSection).toBeUndefined();
      expect(component.selectedRequiredStandard).toBeUndefined();
    });
    it('should handle when I pick a section', () => {
      component.handleSelect('section' as unknown as SectionIVA, Types.Section);

      expect(component.selectedSection).toBe('section');
      expect(component.selectedRequiredStandard).toBeUndefined();
    });
    it('should handle when I pick a required standard', () => {
      const spy = jest.spyOn(router, 'navigate');

      component.handleSelect({ refCalculation: '1.2' } as unknown as RequiredStandard, Types.RequiredStandard);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(['1.2'], expect.anything());
      expect(component.selectedRequiredStandard).toStrictEqual({ refCalculation: '1.2' });
    });
    it('should error when I try call it with another type', () => {
      const spy = jest.spyOn(console, 'error');

      component.handleSelect(undefined, undefined);

      expect(spy).toHaveBeenCalled();
    });
  });
});

enum Types {
  InspectionType,
  Section,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  RequiredStandard,
}
