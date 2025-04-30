import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { TextAreaComponent } from '../text-area.component';

@Component({
	selector: 'app-host-component',
	template: `<form [formGroup]="form">
    <app-text-area name="foo" formControlName="foo"></app-text-area>
  </form> `,
	imports: [TextAreaComponent, FormsModule, ReactiveFormsModule],
})
class HostComponent {
	form = new FormGroup({
		foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, ''),
	});
}

describe('TextAreaComponent', () => {
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
