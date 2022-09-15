import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Defect } from '@models/defects/defect.model';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';
import { Item } from '@models/defects/item.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';

import { DefectSelectComponent } from './defect-select.component';

describe('DefectSelectComponent', () => {
  let component: DefectSelectComponent;
  let fixture: ComponentFixture<DefectSelectComponent>;

  const defect: Defect = {
    additionalInfo: {},
    forVehicleType: [VehicleTypes.PSV],
    imDescription: 'some description',
    imNumber: 1,
    items: [
      {
        deficiencies: [
          {
            deficiencyCategory: deficiencyCategory.Advisory,
            deficiencyId: 'some id',
            deficiencySubId: 'some sub id',
            deficiencyText: 'hey yo',
            forVehicleType: [VehicleTypes.PSV],
            ref: 'some ref',
            stdForProhibition: false
          }
        ],
        forVehicleType: [VehicleTypes.PSV],
        itemDescription: 'yolo',
        itemNumber: 2
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DefectSelectComponent],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all types', () => {
    enum Types {
      Defect,
      Item,
      Deficiency
    }
    expect(component.types).toStrictEqual(Types);
  });

  describe('hasItems', () => {
    it('should correctly detect a defect with items', () => {
      expect(component.hasItems(defect)).toBeTruthy();
    });

    it('should correctly detect a defect without items', () => {
      const defectWithNoItems: Defect = { ...defect, items: [] };
      expect(component.hasItems(defectWithNoItems)).toBeFalsy();
    });
  });

  describe('hasDeficiencies', () => {
    it('should correctly detect an item with deficiencies', () => {
      expect(component.hasDeficiencies(defect.items[0])).toBeTruthy();
    });

    it('should correctly detect an item without deficiencies', () => {
      const itemWithNoDeficiencies: Item = {
        ...defect.items[0],
        deficiencies: []
      };

      expect(component.hasDeficiencies(itemWithNoDeficiencies)).toBeFalsy();
    });
  });

  describe('toggleEditMode', () => {
    it('should toggle isEditing on and reset selection', () => {
      component.toggleEditMode();

      expect(component.isEditing).toBeTruthy();
      expect(component.selectedDefect).toBeUndefined();
      expect(component.selectedItem).toBeUndefined();
      expect(component.selectedDeficiency).toBeUndefined();
    });
  });

  describe('handleSelect', () => {
    it('should set selected defect and reset selected item and deficiency', () => {
      component.handleSelect(defect, component.types.Defect);

      expect(component.selectedDefect).toBe(defect);
      expect(component.selectedItem).toBeUndefined();
      expect(component.selectedDeficiency).toBeUndefined();
    });

    it('should set selected item and reset selected deficiency', () => {
      component.handleSelect(defect.items[0], component.types.Item);

      expect(component.selectedItem).toBe(defect.items[0]);
      expect(component.selectedDeficiency).toBeUndefined();
    });

    it('should set selected deficiency and toggle isEditing', () => {
      jest.spyOn(component, 'toggleEditMode');

      component.handleSelect(defect.items[0].deficiencies[0], component.types.Deficiency);

      expect(component.toggleEditMode).toHaveBeenCalledTimes(1);
    });
  });
});
