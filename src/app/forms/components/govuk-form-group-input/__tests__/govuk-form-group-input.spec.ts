import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { COMMON_LABEL_SUFFIXES, GovukFormGroupInputComponent } from '../govuk-form-group-input.component';

describe('GovukFormGroupInputComponent', () => {
	let component: GovukFormGroupInputComponent;
	let fixture: ComponentFixture<GovukFormGroupInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [ControlContainer, provideMockStore({ initialState: initialAppState })],
			imports: [GovukFormGroupInputComponent, FormsModule, ReactiveFormsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(GovukFormGroupInputComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('id', 'test-input');

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should write value and propagate via onChange', () => {
		const onChangeSpy = jest.spyOn(component, 'onChange');

		component.writeValue('hello');

		expect(component.value()).toBe('hello');
		expect(onChangeSpy).toHaveBeenCalledWith('hello');
	});

	it('should convert empty to null when nullIfEmpty=true', () => {
		fixture.componentRef.setInput('nullIfEmpty', true);

		component.writeValue('');

		expect(component.value()).toBeNull();
	});

	it('should emit blur event and call onTouched', () => {
		const blurSpy = jest.spyOn(component.blur, 'emit');
		const touchedSpy = jest.spyOn(component, 'onTouched');

		const event = new FocusEvent('blur');

		component.onBlur(event);

		expect(blurSpy).toHaveBeenCalledWith(event);
		expect(touchedSpy).toHaveBeenCalled();
	});

	it('should return null when no suffix present', () => {
		fixture.componentRef.setInput('suffix', undefined);
		expect(component.getScreenReaderLabelSuffix()).toBeNull();
	});

	it('should use COMMON_LABEL_SUFFIXES when suffix provided', () => {
		fixture.componentRef.setInput('suffix', 'kg');
		expect(component.getScreenReaderLabelSuffix()).toBe(COMMON_LABEL_SUFFIXES['kg']);
	});

	it('should use the custom screen reader label suffix if provided', () => {
		fixture.componentRef.setInput('customScreenReaderLabelSuffix', 'custom label');
		fixture.componentRef.setInput('suffix', 'kg');

		expect(component.getScreenReaderLabelSuffix()).toBe('custom label');
	});

	it('should compute style classes based on width and error state', () => {
		jest.spyOn(component, 'hasError', 'get').mockReturnValue({});
		fixture.componentRef.setInput('width', FormNodeWidth.L);

		expect(component.style).toContain('govuk-input--width-10');
		expect(component.style).toContain('govuk-input--error');
	});

	it('should render text input when type="text"', () => {
		fixture.detectChanges();

		const input = fixture.debugElement.query(By.css('input'));

		expect(input).toBeTruthy();
		expect(input.attributes['type']).toBeUndefined(); // default text
	});

	it('should render number input when type="number"', () => {
		fixture.componentRef.setInput('type', 'number');
		fixture.detectChanges();

		const input = fixture.debugElement.query(By.css('input[type="number"]'));

		expect(input).toBeTruthy();
	});

	it('should bind maxlength attribute', () => {
		fixture.componentRef.setInput('maxlength', 5);
		fixture.detectChanges();
		const input = fixture.debugElement.query(By.css('input'));

		expect(input.attributes['maxlength']).toBe('5');
	});

	it('should render string suffix when provided', () => {
		fixture.componentRef.setInput('suffix', 'kg');
		fixture.detectChanges();

		const suffixEl = fixture.debugElement.query(By.css('.govuk-input__suffix'));

		expect(suffixEl.nativeElement.textContent.trim()).toBe('kg');
	});

	it('should set aria-labelledby and aria-describedby', () => {
		fixture.componentRef.setInput('id', 'test-input');
		fixture.detectChanges();

		const input = fixture.debugElement.query(By.css('input'));

		expect(input.attributes['aria-labelledby']).toBe('test-input-label');
		expect(input.attributes['aria-describedby']).toBe('test-input-hint');
	});

	it('should call writeValue on ngModelChange', () => {
		const writeSpy = jest.spyOn(component, 'writeValue');
		fixture.detectChanges();

		const input = fixture.debugElement.query(By.css('input')).nativeElement;
		input.value = 'abc';
		input.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		expect(writeSpy).toHaveBeenCalled();
	});

	it('should propagate null without throwing when a text input is cleared', () => {
		const onChange = jest.fn();
		component.registerOnChange(onChange);
		const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
		input.value = '';

		expect(() => input.dispatchEvent(new Event('input'))).not.toThrow();
		expect(onChange).toHaveBeenCalledWith(null);
	});
});
