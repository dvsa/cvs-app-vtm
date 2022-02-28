import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  AbstractControl,
  FormGroup
} from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { DeclarationSeenEditComponent } from './declaration-seen-edit.component';
import { By } from '@angular/platform-browser';

describe('DeclarationSeenEditComponent', () => {
  let fixture: ComponentFixture<DeclarationSeenEditComponent>;
  let component: DeclarationSeenEditComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [DeclarationSeenEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
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
    fixture = TestBed.createComponent(DeclarationSeenEditComponent);
    component = fixture.componentInstance;
    component.adrDetails = TESTING_UTILS.mockAdrDetails({
      brakeDeclarationsSeen: true,
      brakeEndurance: true,
      weight: '2'
    });
  });

  it('should create with initialized form controls', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(component.adrForm.get('brakeDeclarationsSeen').value).toBeTruthy();
    expect(component.adrForm.get('brakeEndurance').value).toBeTruthy();
    expect(component.adrForm.get('weight').value).toEqual('2000');
    expect(fixture).toMatchSnapshot();
  });

  describe('handleFormChanges', () => {
    let ele: DebugElement;

    beforeEach(() => {
      ele = fixture.debugElement;
      component.adrDetails = TESTING_UTILS.mockAdrDetails({
        brakeDeclarationsSeen: true,
        brakeEndurance: true
      });
    });

    it(`should reset brakeDeclarationIssuer & brakeEndurance controls when brakeDeclarationsSeen
    is unchecked`, () => {
      fixture.detectChanges();

      const brakeDeclarationSeen: HTMLInputElement = ele.query(
        By.css('[id=brakeDeclarationsSeen]')
      ).nativeElement;

      brakeDeclarationSeen.click(); // unchecked

      expect(component.adrForm.get('brakeDeclarationIssuer').value).toBeNull();
      expect(component.adrForm.get('brakeEndurance').value).toBeNull();
    });

    describe('brakeEdurance', () => {
      let brakeEdurance: HTMLInputElement;

      beforeEach(() => {
        brakeEdurance = ele.query(By.css('[id=brakeEndurance]')).nativeElement;
      });

      it('should reset the weight control when brakeEndurance is unchecked', () => {
        fixture.detectChanges();

        brakeEdurance.click(); // unchecked
        expect(component.adrForm.get('weight').value).toBeNull();
        expect(component.adrForm.get('weight').validator).toBeNull();
      });

      it('should set required validator when brakeEdurance is checked', () => {
        fixture.detectChanges();

        brakeEdurance.click(); // unchecked
        brakeEdurance.click(); // checked
        expect(component.adrForm.get('weight').validator).toBeDefined();
      });
    });
  });
});
