import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';

import { BaseControlComponent } from '../../base-control/base-control.component';
import { ReadOnlyComponent } from '../read-only.component';

@Component({
	selector: 'app-host-component',
	template: `<form [formGroup]="form">
    <app-read-only name="foo" label="Foo" formControlName="foo"></app-read-only>
  </form> `,
	imports: [FormsModule, ReactiveFormsModule, BaseControlComponent, ReadOnlyComponent],
})
class HostComponent {
	form = new FormGroup({
		foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, ''),
	});
}

describe('ReadOnlyComponent', () => {
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
