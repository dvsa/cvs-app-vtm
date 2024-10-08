import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl, Validators } from '@angular/forms';
import { FieldErrorMessageComponent } from '@forms/components/field-error-message/field-error-message.component';
import { CustomFormControl, FormNodeTypes, FormNodeValueFormat } from '@services/dynamic-forms/dynamic-form.types';
import { TextInputComponent } from '../text-input.component';

describe('TextInputComponent', () => {
	let component: TextInputComponent;
	let fixture: ComponentFixture<TextInputComponent>;
	const metadata = {
		name: 'foo',
		type: FormNodeTypes.CONTROL,
		children: [],
		valueFormat: FormNodeValueFormat.UPPERCASE,
	};

	beforeEach(async () => {
		const NG_CONTROL_PROVIDER = {
			provide: NgControl,
			useClass: class extends NgControl {
				control = new CustomFormControl(metadata, '', [Validators.required]);
				viewToModelUpdate() {}
			},
		};

		await TestBed.configureTestingModule({
			declarations: [TextInputComponent, FieldErrorMessageComponent],
			imports: [FormsModule],
		})
			.overrideComponent(TextInputComponent, { add: { providers: [NG_CONTROL_PROVIDER] } })
			.compileComponents();

		fixture = TestBed.createComponent(TextInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('handleChange', () => {
		it('should call the formatString method if the value is a string', () => {
			const formatString = jest.spyOn(component, 'formatString');
			const onChange = jest.spyOn(component, 'onChange');
			component.handleChange('string');
			expect(formatString).toHaveBeenCalled();
			expect(onChange).toHaveBeenCalledWith('STRING');
			expect(component.value).toBe('STRING');
		});
	});
});
