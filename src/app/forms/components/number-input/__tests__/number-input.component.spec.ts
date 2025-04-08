import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { BaseControlComponent } from '../../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../../field-error-message/field-error-message.component';
import { FieldWarningMessageComponent } from '../../field-warning-message/field-warning-message.component';
import { NumberInputComponent } from '../number-input.component';

@Component({
	selector: 'app-host-component',
	template: `<form [formGroup]="form">
    <app-number-input name="foo" label="Foo" formControlName="foo"></app-number-input>
  </form> `,
	imports: [
		NumberInputComponent,
		BaseControlComponent,
		FieldErrorMessageComponent,
		FieldWarningMessageComponent,
		FormsModule,
		ReactiveFormsModule,
	],
})
class HostComponent {
	form = new FormGroup({
		foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, ''),
	});
}

describe('NumberInputComponent', () => {
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

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
