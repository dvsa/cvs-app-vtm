import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';
import { of, EMPTY } from 'rxjs';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { MemoEditComponent } from './memo-edit.component';
import { ValidationMapper, STATUS } from '../../adr-validation.mapper';

describe('MemoEditComponent', () => {
  let fixture: ComponentFixture<MemoEditComponent>;
  let component: MemoEditComponent;
  let validationMapper: ValidationMapper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [MemoEditComponent],
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
    validationMapper = TestBed.get(ValidationMapper);
    fixture = TestBed.createComponent(MemoEditComponent);
    component = fixture.componentInstance;
    component.hasMemosApplied = true;
  });

  it('should create with initialized form controls', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should call vehicleTypeSelected on validationMapper if vehicle type exist', () => {
    const type = TESTING_UTILS.mockVehicleDetails().type;
    spyOn(validationMapper, 'vehicleTypeSelected');
    component.vehicleType = type;

    fixture.detectChanges();

    expect(validationMapper.vehicleTypeSelected).toHaveBeenCalledWith(type);
  });

  describe('handleFormChanges', () => {
    it('should hide section when memoValidationState$ is HIDDEN', () => {
      spyOn(validationMapper, 'getCurrentState').and.callFake(() =>
        of({ memoEdit: STATUS.HIDDEN })
      );

      fixture.detectChanges();

      let memoState: STATUS;
      component.memoValidationState$.subscribe(({ memoEdit }) => (memoState = memoEdit));

      expect(memoState).toEqual(STATUS.HIDDEN);
      expect(fixture).toMatchSnapshot();
      expect(component.adrForm.get('memosApply').value).toBeNull();
    });

    it('should show section when memoValidationState$ has no status', () => {
      spyOn(validationMapper, 'getCurrentState').and.callFake(() => of(EMPTY));

      fixture.detectChanges();

      let memoState: STATUS;
      component.memoValidationState$.subscribe(({ memoEdit }) => (memoState = memoEdit));
      expect(component.showMemoEdit).toBeTruthy();
    });
  });
});
