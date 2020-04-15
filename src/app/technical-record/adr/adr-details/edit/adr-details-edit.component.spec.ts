import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SharedModule } from '@app/shared';
import { AdrDetailsEditComponent } from './adr-details-edit.component';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { ValidationMapper } from '../../adr-validation.mapper';

describe('AdrDetailsEditComponent', () => {
  let component: AdrDetailsEditComponent;
  let fixture: ComponentFixture<AdrDetailsEditComponent>;
  let validationMapper: ValidationMapper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [AdrDetailsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ValidationMapper,
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({
              adrDetails: new FormGroup({})
            }) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    validationMapper = TestBed.get(ValidationMapper);
    fixture = TestBed.createComponent(AdrDetailsEditComponent);
    component = fixture.componentInstance;
    component.adrDetails = TESTING_UTILS.mockAdrDetails();
    component.metaData = TESTING_UTILS.mockMetaData();
    fixture.detectChanges();
  });

  it('should create with initialized form controls', () => {
    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  describe('handleFormChanges', () => {
    describe('VehicleTypeChange', () => {
      it('should call vehicleTypeChangedHandler with selected vehicle type', fakeAsync(() => {
        spyOn(validationMapper, 'vehicleTypeSelected');

        const vehicleTypeElement: HTMLSelectElement = fixture.debugElement.query(
          By.css('[id="vehicleType"]')
        ).nativeElement;

        const selectedType = TESTING_UTILS.mockMetaData().adrDetails.vehicleDetails.typeFe[0];
        vehicleTypeElement.value = selectedType;
        vehicleTypeElement.dispatchEvent(new Event('change'));
        tick(1000);

        const typeDispatched = component.vehicleDetails.get('type').value;
        expect(validationMapper.vehicleTypeSelected).toHaveBeenCalledWith(typeDispatched);
      }));
    });

    describe('DangerousGoods', () => {
      let selectedDangerousGoods: HTMLElement;

      it('should show compatibilityGroupJ when dangerous goods of Explosive type is selected', () => {
        selectedDangerousGoods = fixture.debugElement.query(By.css('[id="permittedGood_2"]'))
          .nativeElement;
        selectedDangerousGoods.click();

        expect(component.showCompatibilityGroupJ).toBeTruthy();
      });

      it('should hide compatibilityGroupJ when dangerous goods of Explosive type is NOT selected', () => {
        selectedDangerousGoods = fixture.debugElement.query(By.css('[id="permittedGood_1"]'))
          .nativeElement;
        selectedDangerousGoods.click();

        expect(component.showCompatibilityGroupJ).toBeFalsy();
      });
    });
  });
});
