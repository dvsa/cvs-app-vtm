import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl, Validators } from '@angular/forms';
import { CustomFormControl, FormNode, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { BaseControlComponent } from '../base-control.component';

describe('BaseControlComponent', () => {
	let component: BaseControlComponent;
	let fixture: ComponentFixture<BaseControlComponent>;

	const controlMetaData: FormNode = { name: 'testControl', type: FormNodeTypes.CONTROL, children: [] };

	describe('has control binding', () => {
		beforeEach(async () => {
			const NG_CONTROL_PROVIDER = {
				provide: NgControl,
				useClass: class extends NgControl {
					control = new CustomFormControl(controlMetaData, '', [Validators.required]);
					viewToModelUpdate() {}
				},
			};

			await TestBed.configureTestingModule({
				imports: [FormsModule, BaseControlComponent, BaseControlComponent],
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
			component.registerOnChange('FUNCTION' as unknown as () => void);
			expect(component.onChange).toBe('FUNCTION');
		});

		it('should register it has been touched', () => {
			component.registerOnTouched('FUNCTION' as unknown as () => void);
			expect(component.onTouched).toBe('FUNCTION');
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

			const handleEventSpy = jest.spyOn(component, 'handleEvent');
			const state = component.handleEvent(new Event('submit'));
			expect(handleEventSpy).toHaveBeenCalled();
			expect(state).toBeNull();
		});

		describe('interacting with the value', () => {
			it('writeValue should set the value', () => {
				component.writeValue('anything');
				expect(component.value).toBe('anything');
			});

			it('set should set the value', () => {
				component.value = 'anything';
				expect(component.value).toBe('anything');
			});
		});

		describe('validation', () => {
			it('should get mapped message for first validation error', () => {
				fixture.componentRef.setInput('label', 'Test control');
				component.control?.markAsTouched();
				fixture.detectChanges();
				expect(component.error).toBe('Test control is required');
			});

			it('should get "" when control is valid', () => {
				fixture.componentRef.setInput('label', 'Test control');
				component.control?.patchValue('test');
				component.control?.markAsTouched();
				fixture.detectChanges();
				expect(component.error).toBe('');
			});
		});
	});

	describe('does not have control binding', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [FormsModule, BaseControlComponent],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(BaseControlComponent);
			component = fixture.componentInstance;
		});

		it('shoud throw no control binding error', () => {
			expect(component).toBeTruthy();
			expect(() => fixture.detectChanges()).toThrow(Error);
		});

		it('should return undefined for metadata', () => {
			expect(component.meta).toBeUndefined();
		});

		it('disabled should default to false', () => {
			expect(component.disabled).toBeFalsy();
		});
	});
});
