import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { ApprovalTypeNumber } from '../approval-type-number';

@Component({
	selector: 'app-host-component',
	template: `<form [formGroup]="form">
    <approval-type-number-input 
      label="Approval type number"
      formControlName="approvalTypeNumber" 
      [width]="FormNodeWidth.XL"
      [approvalType]="form.controls.approvalType.getRawValue()">
    </approval-type-number-input>
  </form> `,
	imports: [FormsModule, ReactiveFormsModule, ApprovalTypeNumber],
})
class HostComponent {
	readonly FormNodeWidth = FormNodeWidth;

	form = new FormGroup({
		approvalType: new FormControl<string>(''),
		approvalTypeNumber: new FormControl<string>(''),
	});

	@ViewChild(ApprovalTypeNumber)
	approvalTypeNumberComponent!: ApprovalTypeNumber;
}
describe('ApprovalTypeNumber', () => {
	let component: HostComponent;
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('onInit', () => {
		it('should listen for form changes, and call onChange with the formatted approval type number', () => {
			const onChangeSpy = jest.spyOn(component.approvalTypeNumberComponent, 'onChange');
			const subscribeSpy = jest.spyOn(component.approvalTypeNumberComponent.form.valueChanges, 'subscribe');
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.ECSSTA);
			component.approvalTypeNumberComponent.form.patchValue({
				approvalTypeNumber1: '01',
				approvalTypeNumber2: '23',
				approvalTypeNumber3: '4567',
				approvalTypeNumber4: '891034',
			});
			component.approvalTypeNumberComponent.ngOnInit();
			expect(subscribeSpy).toHaveBeenCalled();
			expect(onChangeSpy).toHaveBeenCalledWith('e01*KS23/4567*891034');
		});
	});

	describe('parseApprovalTypeNumber', () => {
		it('should do nothing if the approval type or approval type number is null', () => {
			const spy1 = jest.spyOn(component.approvalTypeNumberComponent, 'parseGroup1ApprovalTypeNumber');
			const spy2 = jest.spyOn(component.approvalTypeNumberComponent, 'parseGroup2ApprovalTypeNumber');
			component.approvalTypeNumberComponent.parseApprovalTypeNumber(null);
			expect(spy1).not.toHaveBeenCalled();
			expect(spy2).not.toHaveBeenCalled();
		});

		it('should call the correct parsing strategy based on the approval type', () => {
			const spy1 = jest.spyOn(component.approvalTypeNumberComponent, 'parseGroup1ApprovalTypeNumber');
			const spy2 = jest.spyOn(component.approvalTypeNumberComponent, 'parseGroup2ApprovalTypeNumber');
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.NTA);
			component.approvalTypeNumberComponent.parseApprovalTypeNumber('1234567890');
			expect(spy1).toHaveBeenCalledWith('1234567890');
			expect(spy2).not.toHaveBeenCalled();
		});
	});

	describe('parseGroup1ApprovalTypeNumber', () => {
		it('should patch the approval type number internal form with a correctly parsed NTA number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.NTA);
			component.approvalTypeNumberComponent.parseGroup1ApprovalTypeNumber('1234567890');
			expect(component.approvalTypeNumberComponent.form.get('approvalTypeNumber1')?.value).toBe('1234567890');
		});

		it('should patch the approval type number internal form with a correctly parsed IVA number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.IVA);
			component.approvalTypeNumberComponent.parseGroup1ApprovalTypeNumber('1234567890');
			expect(component.approvalTypeNumberComponent.form.get('approvalTypeNumber1')?.value).toBe('1234567890');
		});

		it('should patch the approval type number internal form with a correctly parsed IVA_DVSA_NI number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.IVA_DVSA_NI);
			component.approvalTypeNumberComponent.parseGroup1ApprovalTypeNumber('1234567890');
			expect(component.approvalTypeNumberComponent.form.get('approvalTypeNumber1')?.value).toBe('1234567890');
		});
	});

	describe('parseGroup2ApprovalTypeNumber', () => {
		it('should patch the approval type number internal form with a correctly parsed ECTA number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.ECTA);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('E23*2323/2323*232232');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '23',
				approvalTypeNumber2: '2323',
				approvalTypeNumber3: '2323',
				approvalTypeNumber4: '232232',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed NSSTA number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.NSSTA);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('E45*NKS*454454');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '45',
				approvalTypeNumber2: '454454',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed GB_WVTA number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.GB_WVTA);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('676*7676/6767*6767676');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '676',
				approvalTypeNumber2: '7676',
				approvalTypeNumber3: '6767',
				approvalTypeNumber4: '6767676',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed UKNI_WVTA number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.UKNI_WVTA);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('811*8989/8989*898989');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '8',
				approvalTypeNumber2: '8989',
				approvalTypeNumber3: '8989',
				approvalTypeNumber4: '898989',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed EU_WVTA_PRE_23 number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.EU_WVTA_PRE_23);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('e23*2323/2323*232232');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '23',
				approvalTypeNumber2: '2323',
				approvalTypeNumber3: '2323',
				approvalTypeNumber4: '232232',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed EU_WVTA_23_ON number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.EU_WVTA_23_ON);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('e23*2323/2323*232232');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '23',
				approvalTypeNumber2: '2323',
				approvalTypeNumber3: '2323',
				approvalTypeNumber4: '232232',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed QNIG number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.QNIG);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('e23*2323/2323*232232');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '23',
				approvalTypeNumber2: '2323',
				approvalTypeNumber3: '2323',
				approvalTypeNumber4: '232232',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed IVA_VCA number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.IVA_VCA);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('N11*NIV11/1111*111111');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '11',
				approvalTypeNumber2: '1111',
				approvalTypeNumber3: '111111',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed SMALL_SERIES_NKSXX number', () => {
			jest
				.spyOn(component.approvalTypeNumberComponent, 'approvalType')
				.mockReturnValue(ApprovalType.SMALL_SERIES_NKSXX);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('111*NKS11/1111*111111');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '1',
				approvalTypeNumber2: '11',
				approvalTypeNumber3: '1111',
				approvalTypeNumber4: '111111',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed SMALL_SERIES_NKS number', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.SMALL_SERIES_NKS);
			component.approvalTypeNumberComponent.parseGroup2ApprovalTypeNumber('111*NKS*111111');
			expect(component.approvalTypeNumberComponent.form?.value).toEqual({
				approvalTypeNumber1: '1',
				approvalTypeNumber2: '111111',
			});
		});
	});

	describe('processApprovalTypeNumber', () => {
		it('should convert the parts of an NTA approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.NTA);
			expect(
				component.approvalTypeNumberComponent.processApprovalTypeNumber('1234567890', undefined, undefined, undefined)
			).toBe('1234567890');
		});

		it('should convert the parts of an IVA approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.IVA);
			expect(
				component.approvalTypeNumberComponent.processApprovalTypeNumber('1234567890', undefined, undefined, undefined)
			).toBe('1234567890');
		});

		it('should convert the parts of an IVA_DVSA_NI approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.IVA_DVSA_NI);
			expect(
				component.approvalTypeNumberComponent.processApprovalTypeNumber('1234567890', undefined, undefined, undefined)
			).toBe('1234567890');
		});

		it('should convert the parts of an ECTA approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.ECTA);
			expect(component.approvalTypeNumberComponent.processApprovalTypeNumber('11', '1111', '1111', '111111')).toBe(
				'e11*1111/1111*111111'
			);
		});

		it('should convert the parts of an NSSTA approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.NSSTA);
			expect(
				component.approvalTypeNumberComponent.processApprovalTypeNumber('11', '111111', undefined, undefined)
			).toBe('e11*NKS*111111');
		});

		it('should convert the parts of a GB_WVTA approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.GB_WVTA);
			expect(component.approvalTypeNumberComponent.processApprovalTypeNumber('111', '1111', '1111', '1111111')).toBe(
				'111*1111/1111*1111111'
			);
		});

		it('should convert the parts of a UKNI_WVTA approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.UKNI_WVTA);
			expect(component.approvalTypeNumberComponent.processApprovalTypeNumber('1', '1111', '1111', '111111')).toBe(
				'111*1111/1111*111111'
			);
		});

		it('should convert the parts of a EU_WVTA_PRE_23 approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.EU_WVTA_PRE_23);
			expect(component.approvalTypeNumberComponent.processApprovalTypeNumber('11', '1111', '1111', '111111')).toBe(
				'e11*1111/1111*111111'
			);
		});

		it('should convert the parts of a EU_WVTA_23_ON approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.EU_WVTA_23_ON);
			expect(component.approvalTypeNumberComponent.processApprovalTypeNumber('11', '1111', '1111', '111111')).toBe(
				'e11*1111/1111*111111'
			);
		});

		it('should convert the parts of a QNIG approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.QNIG);
			expect(component.approvalTypeNumberComponent.processApprovalTypeNumber('11', '1111', '1111', '111111')).toBe(
				'e11*1111/1111*111111'
			);
		});

		it('should convert the parts of a IVA_VCA approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.IVA_VCA);
			expect(component.approvalTypeNumberComponent.processApprovalTypeNumber('11', '1111', '111111', undefined)).toBe(
				'n11*NIV11/1111*111111'
			);
		});

		it('should convert the parts of a SMALL_SERIES_NKSXX approval type number to a single string', () => {
			jest
				.spyOn(component.approvalTypeNumberComponent, 'approvalType')
				.mockReturnValue(ApprovalType.SMALL_SERIES_NKSXX);
			expect(component.approvalTypeNumberComponent.processApprovalTypeNumber('1', '11', '1111', '111111')).toBe(
				'111*NKS11/1111*111111'
			);
		});

		it('should convert the parts of a SMALL_SERIES_NKS approval type number to a single string', () => {
			jest.spyOn(component.approvalTypeNumberComponent, 'approvalType').mockReturnValue(ApprovalType.SMALL_SERIES_NKS);
			expect(component.approvalTypeNumberComponent.processApprovalTypeNumber('1', '111111', undefined, undefined)).toBe(
				'111*NKS*111111'
			);
		});
	});
});
