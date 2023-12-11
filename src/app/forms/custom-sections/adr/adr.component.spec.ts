import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { AdrComponent } from './adr.component';

const mockTechRecordService = {
  updateEditingTechRecord: jest.fn(),
};

describe('AdrComponent', () => {
  let component: AdrComponent;
  let fixture: ComponentFixture<AdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrComponent],
      imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        { provide: TechnicalRecordService, useValue: mockTechRecordService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdrComponent);
    component = fixture.componentInstance;
    component.techRecord = {
      systemNumber: 'foo',
      createdTimestamp: 'bar',
      vin: 'testVin',
      techRecord_vehicleType: VehicleTypes.PSV,
      techRecord_brakes_dtpNumber: '000000',
      techRecord_bodyModel: 'model',
      techRecord_bodyType_description: 'type',
      techRecord_chassisMake: 'chassisType',
    } as unknown as TechRecordType<'hgv'>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkForDangerousGoodsFlag', () => {
    it('should return false if dangerousGoods is undefined', () => {
      delete component.techRecord.techRecord_adrDetails_dangerousGoods;
      expect(component.checkForDangerousGoodsFlag()).toBe(false);
    });
    it('should return true if dangerousGoods is defined', () => {
      component.techRecord.techRecord_adrDetails_dangerousGoods = true;
      expect(component.checkForDangerousGoodsFlag()).toBe(true);
    });
  });

  describe('checkForTankStatementSelectFlag', () => {
    it('should return false if tankStatement_select is undefined', () => {
      delete component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select;
      expect(component.checkForTankStatementSelectFlag()).toBe(false);
    });
    it('should return true if tankStatement_select is statement', () => {
      component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select = ADRTankDetailsTankStatementSelect.STATEMENT;
      expect(component.checkForTankStatementSelectFlag()).toBe(true);
    });

    it('should return true if tankStatement_select is product list', () => {
      component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select = ADRTankDetailsTankStatementSelect.PRODUCT_LIST;
      expect(component.checkForTankStatementSelectFlag()).toBe(true);
    });
  });

  describe('checkForAdrFields', () => {
    beforeEach(() => {
      delete component.techRecord.techRecord_adrDetails_dangerousGoods;
      delete component.techRecord.techRecord_adrDetails_applicantDetails_name;
    });
    it('should update the dangerousGoods flag to true if adr details exist', () => {
      const spy = jest.spyOn(component, 'checkForDangerousGoodsFlag');
      component.techRecord.techRecord_adrDetails_applicantDetails_name = 'test';
      component.checkForAdrFields();
      expect(spy).toHaveBeenCalled();
      expect(component.techRecord.techRecord_adrDetails_dangerousGoods).toBe(true);
    });
    it('should leave the dangerousGoods flag as undefined if adr details do not exist', () => {
      const spy = jest.spyOn(component, 'checkForDangerousGoodsFlag');
      component.checkForAdrFields();
      expect(spy).toHaveBeenCalled();
      expect(component.techRecord.techRecord_adrDetails_dangerousGoods).toBeUndefined();
    });
  });

  describe('checkForTankStatement', () => {
    beforeEach(() => {
      delete component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select;
      delete component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_statement;
      delete component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
    });
    it('should update the tankStatement_select flag to statement if a tank statement detail exists', () => {
      const spy = jest.spyOn(component, 'checkForTankStatementSelectFlag');
      component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_statement = 'statement';
      component.checkForTankStatement();
      expect(spy).toHaveBeenCalled();
      expect(component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select).toBe(ADRTankDetailsTankStatementSelect.STATEMENT);
    });
    it('should update the tankStatement_select flag to product list if a tank product list detail exists', () => {
      const spy = jest.spyOn(component, 'checkForTankStatementSelectFlag');
      component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo = ['un number'];
      component.checkForTankStatement();
      expect(spy).toHaveBeenCalled();
      expect(component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select).toBe(ADRTankDetailsTankStatementSelect.PRODUCT_LIST);
    });
    it('should leave the tankStatement_select flag as undefined if adr details do not exist', () => {
      const spy = jest.spyOn(component, 'checkForTankStatementSelectFlag');
      component.checkForTankStatement();
      expect(spy).toHaveBeenCalled();
      expect(component.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select).toBeUndefined();
    });
  });
});
