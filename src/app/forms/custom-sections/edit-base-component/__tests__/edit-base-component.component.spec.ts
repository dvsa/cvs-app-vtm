import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	AbstractControl,
	ControlContainer,
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';

@Component({
	selector: 'app-host-component',
	template: `<form [formGroup]="form">
    <app-edit-base-component></app-edit-base-component>
  </form> `,
	imports: [FormsModule, ReactiveFormsModule, EditBaseComponent],
})
class HostComponent {
	form = new FormGroup({});
}

describe('EditBaseComponent', () => {
	let hostComponentInstance: HostComponent;
	let fixture: ComponentFixture<HostComponent>;
	let fb: FormBuilder;
	let form: FormGroup;
	let baseComponentInstance: EditBaseComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				provideMockStore({ initialState: initialAppState }),
				ControlContainer,
				FormBuilder,
				TechnicalRecordService,
				CommonValidatorsService,
			],
			imports: [EditBaseComponent, HttpClientTestingModule, RouterTestingModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HostComponent);
		hostComponentInstance = fixture.componentInstance;
		fixture.detectChanges();
		fb = TestBed.inject(FormBuilder);
		form = fb.group({
			control: fb.control('newControl'),
		});
		baseComponentInstance = fixture.debugElement.queryAll(By.directive(EditBaseComponent))[0]
			.componentInstance as EditBaseComponent;
	});

	it('should create', () => {
		expect(hostComponentInstance).toBeTruthy();
	});

	describe('init', () => {
		it('should add controls to the parent form', () => {
			baseComponentInstance.init(form);
			expect(hostComponentInstance.form.getRawValue()).toEqual(form.getRawValue());
		});
	});

	describe('destroy', () => {
		it('should remove controls from the form', () => {
			baseComponentInstance.destroy(form);
			expect(hostComponentInstance.form.getRawValue()).toEqual(fb.group({}).getRawValue());
		});
	});

	describe('addControls', () => {
		it('should add controls to the form', () => {
			jest.spyOn(form, 'addControl');
			const vehicleControls: Record<string, AbstractControl> = {
				control1: fb.control('value1'),
				control2: fb.control('value2'),
			};
			baseComponentInstance.addControls(vehicleControls, form);
			expect(form.addControl).toHaveBeenCalledTimes(2);
		});
	});
});
