import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DateFocusNextDirective } from '@directives/date-focus-next/date-focus-next.directive';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { provideMockStore } from '@ngrx/store/testing';
import {
	CustomFormControl,
	CustomFormGroup,
	FormNodeTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { initialAppState } from '@store/index';
import { BaseControlComponent } from '../../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../../field-error-message/field-error-message.component';
import { ApprovalTypeInputComponent } from '../approval-type.component';

@Component({
	selector: 'app-host-component',
	template: `<form [formGroup]="form">
      <app-approval-type-input formControlName="approvalType"></app-approval-type-input>
    </form> `,
	styles: [],
})
class HostComponent {
	@ViewChild(ApprovalTypeInputComponent, { static: true }) approvalTypeComponent!: ApprovalTypeInputComponent;

	form = new CustomFormGroup(
		{
			name: 'approvalType',
			type: FormNodeTypes.GROUP,
		},
		{
			approvalType: new CustomFormControl({ name: 'approvalType', type: FormNodeTypes.CONTROL }),
		}
	);
}

describe('ApprovalTypeComponent', () => {
	let component: HostComponent;
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BaseControlComponent, ApprovalTypeInputComponent, FieldErrorMessageComponent, HostComponent],
			imports: [FormsModule, ReactiveFormsModule, DateFocusNextDirective],
			providers: [GlobalErrorService, provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HostComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should initialise all the compoennts subscriptions', () => {
			const spy = jest.spyOn(component.approvalTypeComponent, 'subscribeAndPropagateChanges');
			component.approvalTypeComponent.ngOnInit();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('ngAfterViewInit', () => {
		it('should write the control value back to its control', () => {
			const spy = jest.spyOn(component.approvalTypeComponent, 'valueWriteBack');
			component.approvalTypeComponent.ngAfterContentInit();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('widths', () => {
		it('should return form node widths', () => {
			expect(component.approvalTypeComponent.widths).toBe(FormNodeWidth);
		});
	});

	describe('clearInput', () => {
		it('should set all the approval type input number boxes to undefined, and call onChange', () => {
			const spy = jest.spyOn(component.approvalTypeComponent, 'onChange');
			component.approvalTypeComponent.clearInput();
			expect(component.approvalTypeComponent.approvalTypeNumber1).toBeUndefined();
			expect(component.approvalTypeComponent.approvalTypeNumber2).toBeUndefined();
			expect(component.approvalTypeComponent.approvalTypeNumber3).toBeUndefined();
			expect(component.approvalTypeComponent.approvalTypeNumber4).toBeUndefined();
			expect(spy).toHaveBeenCalledWith(null);
		});
	});

	describe('validate', () => {
		it('should, for the NTA format, call setErrors if the first approvalType number box is NOT filled in', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.NTA;
			component.approvalTypeComponent.approvalTypeNumber1 = ''; // first number is required
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBe(true);
		});

		it('should, for the NTA formats, NOT call setErrors if the first approvalType number box is filled in', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.NTA;
			component.approvalTypeComponent.approvalTypeNumber1 = 'number'; // first number is filled in, which is sufficient
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBeUndefined();
		});

		it('should, for the GB_WVTA format, call setErrors if any of the first four number boxes are NOT filled in', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.GB_WVTA;

			// All numbers missing
			component.approvalTypeComponent.approvalTypeNumber1 = '';
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBe(true);

			// First number filled in, rest missing
			component.approvalTypeComponent.approvalTypeNumber1 = 'number1';
			component.approvalTypeComponent.approvalTypeNumber2 = '';
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBe(true);

			// First two numbers filled in, rest missing
			component.approvalTypeComponent.approvalTypeNumber1 = 'number1';
			component.approvalTypeComponent.approvalTypeNumber2 = 'number2';
			component.approvalTypeComponent.approvalTypeNumber3 = '';
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBe(true);

			// First three numbers filled in, rest missing
			component.approvalTypeComponent.approvalTypeNumber1 = 'number1';
			component.approvalTypeComponent.approvalTypeNumber2 = 'number2';
			component.approvalTypeComponent.approvalTypeNumber3 = 'number3';
			component.approvalTypeComponent.approvalTypeNumber4 = '';
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBe(true);
		});

		it('should, for the GB_WVTA format, NOT call setErrors if all of the first four number boxes are filled in', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.GB_WVTA;
			component.approvalTypeComponent.approvalTypeNumber1 = 'number1';
			component.approvalTypeComponent.approvalTypeNumber2 = 'number2';
			component.approvalTypeComponent.approvalTypeNumber3 = 'number3';
			component.approvalTypeComponent.approvalTypeNumber4 = 'number4';
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBeUndefined();
		});

		it('should, for the NSSTA format, call setErrors if any of the first two number boxes are NOT filled in', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.NSSTA;

			// All numbers missing
			component.approvalTypeComponent.approvalTypeNumber1 = '';
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBe(true);

			// First number filled in, rest missing
			component.approvalTypeComponent.approvalTypeNumber1 = 'number1';
			component.approvalTypeComponent.approvalTypeNumber2 = '';
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBe(true);
		});

		it('should, for the NSSTA format, NOT call setErrors if all of the first two number boxes are filled in', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.NSSTA;
			component.approvalTypeComponent.approvalTypeNumber1 = 'number1';
			component.approvalTypeComponent.approvalTypeNumber2 = 'number2';
			component.approvalTypeComponent.validate();
			expect(component.approvalTypeComponent.errors?.error).toBeUndefined();
		});
	});

	describe('processApprovalTypeNumber', () => {
		it('should, for NTA, return either the first approvalNumber or null if this is falsy', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.NTA;
			const result1 = component.approvalTypeComponent.processApprovalTypeNumber(
				'number1',
				undefined,
				undefined,
				undefined
			);
			expect(result1).toBe('number1');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result2).toBeNull();
		});

		it('should, for ECTA, return either a full ECTA string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.ECTA;

			const result1 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', 'CCCC', 'DDDDDD');
			expect(result1).toBe('eAA*BBBB/CCCC*DDDDDD');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', 'CCCC', undefined);
			expect(result2).toBeNull();

			const result3 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', undefined, undefined);
			expect(result3).toBeNull();

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('AA', undefined, undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result5).toBeNull();
		});

		it('should, for IVA, return either the first approvalNumber or null if this is falsy', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.IVA;
			const result1 = component.approvalTypeComponent.processApprovalTypeNumber(
				'number1',
				undefined,
				undefined,
				undefined
			);
			expect(result1).toBe('number1');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result2).toBeNull();
		});

		it('should, for NSSTA, return either a full NSSTA string if all 2 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.NSSTA;

			const result3 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBBBB', undefined, undefined);
			expect(result3).toBe('eAA*NKS*BBBBBB');

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('AA', undefined, undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result5).toBeNull();
		});

		it('should, for ECSSTA, return either a full ECSSTA string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.ECSSTA;

			const result1 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BB', 'CCCC', 'DDDDDD');
			expect(result1).toBe('eAA*KSBB/CCCC*DDDDDD');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BB', 'CCCC', undefined);
			expect(result2).toBeNull();

			const result3 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BB', undefined, undefined);
			expect(result3).toBeNull();

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('AA', undefined, undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result5).toBeNull();
		});

		it('should, for GB_WVTA, return either a full GB_WVTA string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.GB_WVTA;

			const result1 = component.approvalTypeComponent.processApprovalTypeNumber('AAA', 'BBBB', 'CCCC', 'DDDDDDD');
			expect(result1).toBe('AAA*BBBB/CCCC*DDDDDDD');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('AAA', 'BBBB', 'CCCC', undefined);
			expect(result2).toBeNull();

			const result3 = component.approvalTypeComponent.processApprovalTypeNumber('AAA', 'BBBB', undefined, undefined);
			expect(result3).toBeNull();

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('AAA', undefined, undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result5).toBeNull();
		});

		it('should, for UKNI_WVTA, return either a full UKNI_WVTA string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.UKNI_WVTA;

			const result1 = component.approvalTypeComponent.processApprovalTypeNumber('A', 'BBBB', 'CCCC', 'DDDDDD');
			expect(result1).toBe('A11*BBBB/CCCC*DDDDDD');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('A', 'BBBB', 'CCCC', undefined);
			expect(result2).toBeNull();

			const result3 = component.approvalTypeComponent.processApprovalTypeNumber('A', 'BBBB', undefined, undefined);
			expect(result3).toBeNull();

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('A', undefined, undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result5).toBeNull();
		});

		it('should, for EU_WVTA_PRE_23, return either a full EU_WVTA_PRE_23 string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.EU_WVTA_PRE_23;

			const result1 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', 'CCCC', 'DDDDDD');
			expect(result1).toBe('eAA*BBBB/CCCC*DDDDDD');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', 'CCCC', undefined);
			expect(result2).toBeNull();

			const result3 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', undefined, undefined);
			expect(result3).toBeNull();

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('AA', undefined, undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result5).toBeNull();
		});

		it('should, for EU_WVTA_23_ON, return either a full EU_WVTA_23_ON string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.EU_WVTA_23_ON;

			const result1 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', 'CCCC', 'DDDDDD');
			expect(result1).toBe('eAA*BBBB/CCCC*DDDDDD');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', 'CCCC', undefined);
			expect(result2).toBeNull();

			const result3 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', undefined, undefined);
			expect(result3).toBeNull();

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('AA', undefined, undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result5).toBeNull();
		});

		it('should, for QNIG, return either a full QNIG string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.QNIG;

			const result1 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', 'CCCC', 'DDDDDD');
			expect(result1).toBe('eAA*BBBB/CCCC*DDDDDD');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', 'CCCC', undefined);
			expect(result2).toBeNull();

			const result3 = component.approvalTypeComponent.processApprovalTypeNumber('AA', 'BBBB', undefined, undefined);
			expect(result3).toBeNull();

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('AA', undefined, undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result5).toBeNull();
		});

		it('should, for PROV_GB_WVTA, return either a full PROV_GB_WVTA string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.PROV_GB_WVTA;

			const result1 = component.approvalTypeComponent.processApprovalTypeNumber('AAA', 'BBBB', 'CCCC', 'DDDDDD');
			expect(result1).toBe('AAA*BBBB/CCCC*DDDDDD');

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('AAA', 'BBBB', 'CCCC', undefined);
			expect(result2).toBeNull();

			const result3 = component.approvalTypeComponent.processApprovalTypeNumber('AAA', 'BBBB', undefined, undefined);
			expect(result3).toBeNull();

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('AAA', undefined, undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber(
				undefined,
				undefined,
				undefined,
				undefined
			);
			expect(result5).toBeNull();
		});

		it('should, for SMALL_SERIES_NKSXX, return either a full SMALL_SERIES_NKSXX string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.SMALL_SERIES_NKSXX;

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('XX', 'AA', 'BBBB', 'CCCCCC');
			expect(result2).toBe('XX11*NKSAA/BBBB*CCCCCC');

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('XX', 'AA', undefined, undefined);
			expect(result4).toBeNull();

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber('XX', undefined, undefined, undefined);
			expect(result5).toBeNull();
		});

		it('should, for SMALL_SERIES_NKS, return either a full SMALL_SERIES_NKS string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.SMALL_SERIES_NKS;

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('XX', 'AA', 'BBBB', 'CCCCCC');
			expect(result2).toBe('XX11*NKS*AA');

			const result4 = component.approvalTypeComponent.processApprovalTypeNumber('XX', 'AA', undefined, undefined);
			expect(result4).toBe('XX11*NKS*AA');

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber('XX', undefined, undefined, undefined);
			expect(result5).toBeNull();
		});

		it('should, for IVA_VCA, return either a full IVA_VCA string if all 4 boxes are filled in, otherwise null', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.IVA_VCA;

			const result2 = component.approvalTypeComponent.processApprovalTypeNumber('XX', 'AA', 'BBBB', 'CCCCCC');
			expect(result2).toBe('n11*NIVXX/AA*BBBB');

			const result5 = component.approvalTypeComponent.processApprovalTypeNumber('XX', undefined, undefined, undefined);
			expect(result5).toBeNull();
		});
	});

	describe('getId', () => {
		it('should format the id of the control given its meta name', () => {
			component.approvalTypeComponent.approvalType = ApprovalType.NSSTA;

			const result = component.approvalTypeComponent.getId('name');
			expect(result).toBe('name-approvalTypeNumber1-NSSTA');
		});
	});

	describe('set approval type numbers', () => {
		// the following are added for test coverage as these methods just next subjects
		it('should return void for onTechRecord_approvalTypeNumber1_Change', () => {
			const result = component.approvalTypeComponent.onTechRecord_approvalTypeNumber1_Change('number');
			expect(result).toBeUndefined();
		});

		it('should return void for onTechRecord_approvalTypeNumber2_Change', () => {
			const result = component.approvalTypeComponent.onTechRecord_approvalTypeNumber2_Change('number');
			expect(result).toBeUndefined();
		});

		it('should return void for onTechRecord_approvalTypeNumber3_Change', () => {
			const result = component.approvalTypeComponent.onTechRecord_approvalTypeNumber3_Change('number');
			expect(result).toBeUndefined();
		});

		it('should return void for onTechRecord_approvalTypeNumber4_Change', () => {
			const result = component.approvalTypeComponent.onTechRecord_approvalTypeNumber4_Change('number');
			expect(result).toBeUndefined();
		});
	});

	describe('valueWriteBack', () => {
		it('should return if a falsy value is passed', () => {
			const result = component.approvalTypeComponent.valueWriteBack(null);
			expect(result).toBeUndefined();
		});

		it('should return if the component is missing an approvalType', () => {
			component.approvalTypeComponent.approvalType = undefined;
			const result = component.approvalTypeComponent.valueWriteBack(null);
			expect(result).toBeUndefined();
		});
	});
});
