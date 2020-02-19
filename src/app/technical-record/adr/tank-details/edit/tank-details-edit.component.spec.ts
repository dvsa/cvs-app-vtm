import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TESTING_UTILS } from '@app/utils/testing.utils';
import { SharedModule } from '@app/shared';
import { TankDetailsEditComponent } from './tank-details-edit.component';
import { TankStatement } from '@app/models/Tank';
import { SUBSTANCES } from '@app/app.enums';
import { STATEMENT, PRODUCT_LIST } from '../../adr.constants';

describe('TankDetailsEditComponent', () => {
  let component: TankDetailsEditComponent;
  let fixture: ComponentFixture<TankDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [TankDetailsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankDetailsEditComponent);
    component = fixture.componentInstance;
    component.tank = TESTING_UTILS.mockTank();
  });

  it('should create with initialized form controls', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create with mulitiple UN number controls', () => {
    component.tank = TESTING_UTILS.mockTank({
      tankStatement: { productListUnNo: ['listUN1', 'listUN2'] } as TankStatement
    });
    fixture.detectChanges();

    expect(component.productListUnNo.controls.length).toBe(2);
  });

  it('should add a UN number control', () => {
    fixture.detectChanges();
    component.addUNNumberControl();

    expect(component.productListUnNo.controls.length).toBe(1);
  });

  it('should remove all UN number controls', () => {
    fixture.detectChanges();
    component.removeAllUNNumberControl();

    expect(component.productListUnNo.controls.length).toBe(0);
  });

  describe('handleFormChanges', () => {
    it('should reset controls when substance permitted is selected', () => {
      fixture.detectChanges();

      const selectedSubstance: HTMLElement = fixture.debugElement.query(
        By.css('[id=substancesPermitted_permitted]')
      ).nativeElement;
      selectedSubstance.click();

      expect(component.substancesPermitted.value).toEqual(SUBSTANCES.PERMITTED);
      expect(component.substanceReferenceSelect.value).toBeNull();
      expect(component.tankStatement.get('statement').value).toBeNull();
      expect(component.tankStatement.get('productListRefNo').value).toBeNull();
      expect(component.productListUnNo.value).toEqual([]);
      expect(component.tankStatement.get('productList').value).toBeNull();
    });

    it('should reset controls within product list when Statement option is selected', () => {
      fixture.detectChanges();

      component.substanceReferenceSelect.setValue(STATEMENT);
      expect(component.tankStatement.get('productListRefNo').value).toBeNull();
      expect(component.productListUnNo.value).toEqual([]);
      expect(component.tankStatement.get('productList').value).toBeNull();
    });

    it(`should reset controls within statement when Product list option is selected
      and also default the addition of UN number`, () => {
      fixture.detectChanges();

      component.substanceReferenceSelect.setValue(PRODUCT_LIST);
      expect(component.tankStatement.get('statement').value).toBeNull();
      expect(component.productListUnNo.controls.length).toBe(1);
    });
  });
});
