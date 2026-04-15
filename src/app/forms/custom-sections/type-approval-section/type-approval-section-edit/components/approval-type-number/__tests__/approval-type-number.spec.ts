import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { State, initialAppState } from '@store/index';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { provideMockStore } from '@ngrx/store/testing';
import { ApprovalTypeNumber } from '../approval-type-number';

describe('ApprovalTypeNumber', () => {
	let component: ApprovalTypeNumber;
	let fixture: ComponentFixture<ApprovalTypeNumber>;
	let form: FormGroup;

	beforeEach(async () => {
		form = new FormGroup({
			approvalType: new FormControl<string>(''),
			approvalTypeNumber: new FormControl<string>(''),
		});

		await TestBed.configureTestingModule({
			imports: [ApprovalTypeNumber],
			providers: [
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: ControlContainer, useValue: { control: form } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ApprovalTypeNumber);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('label', 'Approval type number');
		fixture.componentRef.setInput('formControlName', 'approvalTypeNumber');
		fixture.componentRef.setInput('width', FormNodeWidth.XL);
		fixture.componentRef.setInput('approvalType', form.controls['approvalType'].getRawValue());
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('onInit', () => {
		it('should listen for form changes, and call onChange with the formatted approval type number', () => {
			const onChangeSpy = vi.spyOn(component, 'onChange');
			const subscribeSpy = vi.spyOn(component.form.valueChanges, 'subscribe');
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.ECSSTA);
			component.form.patchValue({
				approvalTypeNumber1: '01',
				approvalTypeNumber2: '23',
				approvalTypeNumber3: '4567',
				approvalTypeNumber4: '891034',
			});
			component.ngOnInit();
			expect(subscribeSpy).toHaveBeenCalled();
			expect(onChangeSpy).toHaveBeenCalledWith('e01*KS23/4567*891034');
		});
	});

	describe('parseApprovalTypeNumber', () => {
		it('should do nothing if the approval type or approval type number is null', () => {
			const spy1 = vi.spyOn(component, 'parseGroup1ApprovalTypeNumber');
			const spy2 = vi.spyOn(component, 'parseGroup2ApprovalTypeNumber');
			component.parseApprovalTypeNumber(null);
			expect(spy1).not.toHaveBeenCalled();
			expect(spy2).not.toHaveBeenCalled();
		});

		it('should call the correct parsing strategy based on the approval type', () => {
			const spy1 = vi.spyOn(component, 'parseGroup1ApprovalTypeNumber');
			const spy2 = vi.spyOn(component, 'parseGroup2ApprovalTypeNumber');
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.NTA);
			component.parseApprovalTypeNumber('1234567890');
			expect(spy1).toHaveBeenCalledWith('1234567890');
			expect(spy2).not.toHaveBeenCalled();
		});
	});

	describe('parseGroup1ApprovalTypeNumber', () => {
		it('should patch the approval type number internal form with a correctly parsed NTA number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.NTA);
			component.parseGroup1ApprovalTypeNumber('1234567890');
			expect(component.form.get('approvalTypeNumber1')?.value).toBe('1234567890');
		});

		it('should patch the approval type number internal form with a correctly parsed IVA number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.IVA);
			component.parseGroup1ApprovalTypeNumber('1234567890');
			expect(component.form.get('approvalTypeNumber1')?.value).toBe('1234567890');
		});

		it('should patch the approval type number internal form with a correctly parsed IVA_DVSA_NI number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.IVA_DVSA_NI);
			component.parseGroup1ApprovalTypeNumber('1234567890');
			expect(component.form.get('approvalTypeNumber1')?.value).toBe('1234567890');
		});
	});

	describe('parseGroup2ApprovalTypeNumber', () => {
		it('should patch the approval type number internal form with a correctly parsed ECTA number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.ECTA);
			component.parseGroup2ApprovalTypeNumber('E23*2323/2323*232232');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '23',
				approvalTypeNumber2: '2323',
				approvalTypeNumber3: '2323',
				approvalTypeNumber4: '232232',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed NSSTA number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.NSSTA);
			component.parseGroup2ApprovalTypeNumber('E45*NKS*454454');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '45',
				approvalTypeNumber2: '454454',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed GB_WVTA number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.GB_WVTA);
			component.parseGroup2ApprovalTypeNumber('676*7676/6767*6767676');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '676',
				approvalTypeNumber2: '7676',
				approvalTypeNumber3: '6767',
				approvalTypeNumber4: '6767676',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed UKNI_WVTA number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.UKNI_WVTA);
			component.parseGroup2ApprovalTypeNumber('811*8989/8989*898989');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '8',
				approvalTypeNumber2: '8989',
				approvalTypeNumber3: '8989',
				approvalTypeNumber4: '898989',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed EU_WVTA_PRE_23 number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.EU_WVTA_PRE_23);
			component.parseGroup2ApprovalTypeNumber('e23*2323/2323*232232');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '23',
				approvalTypeNumber2: '2323',
				approvalTypeNumber3: '2323',
				approvalTypeNumber4: '232232',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed EU_WVTA_23_ON number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.EU_WVTA_23_ON);
			component.parseGroup2ApprovalTypeNumber('e23*2323/2323*232232');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '23',
				approvalTypeNumber2: '2323',
				approvalTypeNumber3: '2323',
				approvalTypeNumber4: '232232',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed QNIG number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.QNIG);
			component.parseGroup2ApprovalTypeNumber('e23*2323/2323*232232');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '23',
				approvalTypeNumber2: '2323',
				approvalTypeNumber3: '2323',
				approvalTypeNumber4: '232232',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed IVA_VCA number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.IVA_VCA);
			component.parseGroup2ApprovalTypeNumber('N11*NIV11/1111*111111');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '11',
				approvalTypeNumber2: '1111',
				approvalTypeNumber3: '111111',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed SMALL_SERIES_NKSXX number', () => {
			vi
				.spyOn(component, 'approvalType')
				.mockReturnValue(ApprovalType.SMALL_SERIES_NKSXX);
			component.parseGroup2ApprovalTypeNumber('111*NKS11/1111*111111');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '1',
				approvalTypeNumber2: '11',
				approvalTypeNumber3: '1111',
				approvalTypeNumber4: '111111',
			});
		});

		it('should patch the approval type number internal form with a correctly parsed SMALL_SERIES_NKS number', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.SMALL_SERIES_NKS);
			component.parseGroup2ApprovalTypeNumber('111*NKS*111111');
			expect(component.form?.value).toEqual({
				approvalTypeNumber1: '1',
				approvalTypeNumber2: '111111',
			});
		});
	});

	describe('processApprovalTypeNumber', () => {
		it('should convert the parts of an NTA approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.NTA);
			expect(
				component.processApprovalTypeNumber('1234567890', undefined, undefined, undefined)
			).toBe('1234567890');
		});

		it('should convert the parts of an IVA approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.IVA);
			expect(
				component.processApprovalTypeNumber('1234567890', undefined, undefined, undefined)
			).toBe('1234567890');
		});

		it('should convert the parts of an IVA_DVSA_NI approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.IVA_DVSA_NI);
			expect(
				component.processApprovalTypeNumber('1234567890', undefined, undefined, undefined)
			).toBe('1234567890');
		});

		it('should convert the parts of an ECTA approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.ECTA);
			expect(component.processApprovalTypeNumber('11', '1111', '1111', '111111')).toBe(
				'e11*1111/1111*111111'
			);
		});

		it('should convert the parts of an NSSTA approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.NSSTA);
			expect(
				component.processApprovalTypeNumber('11', '111111', undefined, undefined)
			).toBe('e11*NKS*111111');
		});

		it('should convert the parts of a GB_WVTA approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.GB_WVTA);
			expect(component.processApprovalTypeNumber('111', '1111', '1111', '1111111')).toBe(
				'111*1111/1111*1111111'
			);
		});

		it('should convert the parts of a UKNI_WVTA approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.UKNI_WVTA);
			expect(component.processApprovalTypeNumber('1', '1111', '1111', '111111')).toBe(
				'111*1111/1111*111111'
			);
		});

		it('should convert the parts of a EU_WVTA_PRE_23 approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.EU_WVTA_PRE_23);
			expect(component.processApprovalTypeNumber('11', '1111', '1111', '111111')).toBe(
				'e11*1111/1111*111111'
			);
		});

		it('should convert the parts of a EU_WVTA_23_ON approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.EU_WVTA_23_ON);
			expect(component.processApprovalTypeNumber('11', '1111', '1111', '111111')).toBe(
				'e11*1111/1111*111111'
			);
		});

		it('should convert the parts of a QNIG approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.QNIG);
			expect(component.processApprovalTypeNumber('11', '1111', '1111', '111111')).toBe(
				'e11*1111/1111*111111'
			);
		});

		it('should convert the parts of a IVA_VCA approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.IVA_VCA);
			expect(component.processApprovalTypeNumber('11', '1111', '111111', undefined)).toBe(
				'n11*NIV11/1111*111111'
			);
		});

		it('should convert the parts of a SMALL_SERIES_NKSXX approval type number to a single string', () => {
			vi
				.spyOn(component, 'approvalType')
				.mockReturnValue(ApprovalType.SMALL_SERIES_NKSXX);
			expect(component.processApprovalTypeNumber('1', '11', '1111', '111111')).toBe(
				'111*NKS11/1111*111111'
			);
		});

		it('should convert the parts of a SMALL_SERIES_NKS approval type number to a single string', () => {
			vi.spyOn(component, 'approvalType').mockReturnValue(ApprovalType.SMALL_SERIES_NKS);
			expect(component.processApprovalTypeNumber('1', '111111', undefined, undefined)).toBe(
				'111*NKS*111111'
			);
		});
	});
});
