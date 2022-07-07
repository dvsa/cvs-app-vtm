import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl, Validators } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '../../services/dynamic-form.types';
import { BaseControlComponent } from './base-control.component';

describe('BaseControlComponent', () => {
  let component: BaseControlComponent;
  let fixture: ComponentFixture<BaseControlComponent>;

  const controlMetaData = { name: 'testControl', type: FormNodeTypes.CONTROL, children: [] };

  describe('has control binding', () => {

    beforeEach(async () => {
      const NG_CONTROL_PROVIDER = {
        provide: NgControl,
        useClass: class extends NgControl {
          control = new CustomFormControl(controlMetaData, '', [Validators.required]);
          viewToModelUpdate() {}
        }
      };

      await TestBed
        .configureTestingModule({
          declarations: [BaseControlComponent],
          imports: [FormsModule]
        })
        .overrideComponent(BaseControlComponent, { add: { providers: [NG_CONTROL_PROVIDER] } })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(BaseControlComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should register a change', () => {
      component.registerOnChange('FUNCTION');
      expect(component.onChange).toEqual('FUNCTION');
    });

    it('should register it has been touched', () => {
      component.registerOnTouched('FUNCTION');
      expect(component.onTouched).toEqual('FUNCTION');
    });

    it('should call onChange successfully', () => {
      const onChangepy = jest.spyOn(component, 'onChange');

      component.onChange(null);

      expect(onChangepy).toHaveBeenCalledWith(null);
    });

    it('should call onTouched successfully', () => {
      const onTouchedpy = jest.spyOn(component, 'onTouched');

      component.onTouched();

      expect(onTouchedpy).toHaveBeenCalled();
    });

    it('should return disabled', () => {
      expect(component.disabled).toBeFalsy();
    });

    it('should return metadata', () => {
      expect(component.meta).toEqual(controlMetaData);
    });

    it('should correctly set focused flag', () => {
      component.handleEvent(new Event('focus'));
      expect(component.focused).toBeTruthy();

      component.handleEvent(new Event('blur'));
      expect(component.focused).toBeFalsy();

      console.log = jest.fn();
      const expectedEvent = new Event('submit');
      component.handleEvent(expectedEvent);
      expect(console.log).toHaveBeenCalledWith('unhandled:', expectedEvent);
    });

    describe('interacting with the value', () => {
      it('writeValue should set the value', () => {
        component.writeValue('anything');
        expect(component.value).toEqual('anything');
      });

      it('set should set the value', () => {
        component.value = 'anything';
        expect(component.value).toEqual('anything');
      });
    });

    describe('validation', () => {
      it('should get mapped message for first validation error', () => {
        component.label = 'Test control';
        fixture.whenRenderingDone().then(() => {
          component.control?.markAsTouched();
          fixture.detectChanges();
          expect(component.errorMessage).toBe('Test control is required');
        });
      });
    });
  });

  describe('does not have control binding', () => {
    beforeEach(async () => {
      await TestBed
        .configureTestingModule({ declarations: [BaseControlComponent], imports: [FormsModule] })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(BaseControlComponent);
      component = fixture.componentInstance;
    });

    it('shoud throw no control binding error', () => {
      expect(component).toBeTruthy();
      expect(() => fixture.detectChanges()).toThrowError(Error);
    });

    it('should return undefined for metadata', () => {
      expect(component.meta).toBeUndefined();
    });

    it('should return undefined for disabled', () => {
      expect(component.disabled).toBeUndefined();
    });
  });
});
