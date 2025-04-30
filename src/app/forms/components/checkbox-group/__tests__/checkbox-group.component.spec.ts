import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MultiOptions } from '@models/options.model';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { BaseControlComponent } from '../../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../../field-error-message/field-error-message.component';
import { CheckboxGroupComponent } from '../checkbox-group.component';

@Component({
	selector: 'app-host-component',
	template: `<form [formGroup]="form">
    <app-checkbox-group name="foo" label="Foo" [options]="options" formControlName="foo" [delimited]="delimited"></app-checkbox-group>
  </form> `,
	imports: [FormsModule, ReactiveFormsModule, CheckboxGroupComponent, BaseControlComponent, FieldErrorMessageComponent],
})
class HostComponent {
	form = new FormGroup({
		foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
	});
	delimited?: { regex: string; separator: string };
	options: MultiOptions = [
		{ label: 'Value 1', value: '1' },
		{ label: 'Value 2', value: '2' },
		{ label: 'Value 3', value: '3' },
	];
}

describe('CheckboxGroupComponent', () => {
	let component: HostComponent;
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('value as array', () => {
		it('should be propagated from element to the form control', () => {
			const foo = component.form.get('foo');
			const boxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
			expect(boxes).toHaveLength(3);

			(boxes[1].nativeElement as HTMLInputElement).click();
			(boxes[0].nativeElement as HTMLInputElement).click();
			expect(foo?.value).toEqual(['2', '1']);
			(boxes[1].nativeElement as HTMLInputElement).click();
			(boxes[0].nativeElement as HTMLInputElement).click();
			expect(foo?.value).toBeNull();
		});
	});

	describe('value as separated string', () => {
		it('should be propagated from element to the form control', () => {
			component.delimited = { regex: '\\. (?<!\\..\\. )', separator: '. ' };
			fixture.detectChanges();

			const foo = component.form.get('foo');
			const boxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
			expect(boxes).toHaveLength(3);

			(boxes[1].nativeElement as HTMLInputElement).click();
			(boxes[0].nativeElement as HTMLInputElement).click();
			expect(foo?.value).toBe('2. 1');
			(boxes[1].nativeElement as HTMLInputElement).click();
			(boxes[0].nativeElement as HTMLInputElement).click();
			expect(foo?.value).toBeNull();
		});
	});

	describe('value propagated to element', () => {
		it('should be propagated from the form control to the element', () => {
			component.form.patchValue({ foo: ['1', '2'] });
			fixture.detectChanges();
			const checkedBoxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"][checked=true]'));
			expect(checkedBoxes).toHaveLength(2);
		});
	});
});
