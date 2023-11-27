import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { AdrComponent } from './adr.component';

describe('AdrComponent', () => {
  let component: AdrComponent;
  let fixture: ComponentFixture<AdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrComponent],
      imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
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
});
