import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { BatteryListApplicableEditComponent } from './battery-list-applicable-edit.component';
import { AdrDetails } from '@app/models/adr-details';

describe('BatteryListApplicableEditComponent', () => {
  let fixture: ComponentFixture<BatteryListApplicableEditComponent>;
  let component: BatteryListApplicableEditComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [BatteryListApplicableEditComponent],
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
    fixture = TestBed.createComponent(BatteryListApplicableEditComponent);
    component = fixture.componentInstance;
    component.adrDetails = TESTING_UTILS.mockAdrDetails({
      listStatementApplicable: true,
      batteryListNumber: 'bat123'
    } as AdrDetails);

    fixture.detectChanges();
  });

  it('should create with initialized form controls', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should setup a default battery list reference number', () => {
    const expectedValue = component.adrForm.get('batteryListNumber').value;
    expect(expectedValue).toEqual('bat123');
  });

  describe('handleFormChanges', () => {
    let ele: DebugElement;

    beforeEach(() => {
      ele = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should update the battery list reference number field', () => {
      const refInput: HTMLInputElement = ele.query(By.css('[id=batteryListNumber]'))
        .nativeElement;
      refInput.value = 'bat124';
      refInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const expectedValue = component.adrForm.get('batteryListNumber').value;
      expect(expectedValue).toEqual('bat124');
    });

    it('should clear entered ref number when "no" option is selected', () => {
      const selectedOption: HTMLElement = ele.query(By.css('[id="listStatementApplicable-No"]'))
        .nativeElement;

      selectedOption.click();
      expect(component.adrForm.get('batteryListNumber').value).toBeNull();
    });
  });
});
