import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SharedModule } from '@app/shared';
import { AdrDetailsEditComponent } from './adr-details-edit.component';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('AdrDetailsEditComponent', () => {
  let adrEditComponent: AdrDetailsEditComponent;
  let adrEditFixture: ComponentFixture<AdrDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [AdrDetailsEditComponent],
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
    adrEditFixture = TestBed.createComponent(AdrDetailsEditComponent);
    adrEditComponent = adrEditFixture.componentInstance;
    adrEditComponent.adrDetails = TESTING_UTILS.mockAdrDetails();
    adrEditComponent.metaData = TESTING_UTILS.mockMetaData();
    adrEditFixture.detectChanges();
  });

  it('should create with initialized form controls', () => {
    expect(adrEditComponent).toBeDefined();
    expect(adrEditFixture).toMatchSnapshot();
  });

  describe('DangerousGoods', () => {
    let selectedDangerousGoods: HTMLElement;

    it('should show compatibilityGroupJ when dangerous goods of Explosive type is selected', () => {
      selectedDangerousGoods = adrEditFixture.debugElement.query(By.css('[id="permittedGood_2"]'))
        .nativeElement;
      selectedDangerousGoods.click();

      expect(adrEditComponent.showCompatibilityGroupJ).toBeTruthy();
    });

    it('should hide compatibilityGroupJ when dangerous goods of Explosive type is NOT selected', () => {
      selectedDangerousGoods = adrEditFixture.debugElement.query(By.css('[id="permittedGood_1"]'))
        .nativeElement;
      selectedDangerousGoods.click();

      expect(adrEditComponent.showCompatibilityGroupJ).toBeFalsy();
    });
  });
});
