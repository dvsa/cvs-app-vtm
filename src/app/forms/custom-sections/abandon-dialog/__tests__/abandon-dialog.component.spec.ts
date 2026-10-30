import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { SPECIALIST_TEST_TYPE_IDS, TEST_TYPES_GROUP5_13, TEST_TYPES_MSVA } from '@models/testTypeId.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { SpecialRefData } from '@services/multi-options/multi-options.service';
import { initialAppState } from '@store/index';
import { AbandonDialogComponent } from '../abandon-dialog.component';

describe('AbandonDialogComponent', () => {
	let component: AbandonDialogComponent;
	let fixture: ComponentFixture<AbandonDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AbandonDialogComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				DynamicFormService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AbandonDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should set the template property on init', () => {
			expect(component.template).toBeTruthy();
			expect(component.template?.name).toBe('abandonSection');
		});

		it('should call getTemplate when ngOnInit is invoked', () => {
			const spy = vi.spyOn(component, 'getTemplate');
			component.ngOnInit();
			expect(spy).toHaveBeenCalled();
			expect(component.template).toBe(spy.mock.results[0].value);
		});
	});

	describe('template getter', () => {
		it('should get the template with MSVA reasons for abandoning if the testType is a MSVA', () => {
			const mockTestResult = { testTypes: [{ testTypeId: TEST_TYPES_MSVA[0] }] } as TestResultSchema;
			fixture.componentRef.setInput('testResult', mockTestResult);
			const ReasonsForAbandoning = component.getTemplate().children?.[0].children?.[0].children?.[0].referenceData;
			expect(ReasonsForAbandoning).toEqual(ReferenceDataResourceType.MsvaReasonsForAbandoning);
		});
		it('should get the template with TIR reasons for abandoning if the testType is a TIR', () => {
			const mockTestResult = { testTypes: [{ testTypeId: TEST_TYPES_GROUP5_13[0] }] } as TestResultSchema;
			fixture.componentRef.setInput('testResult', mockTestResult);
			const ReasonsForAbandoning = component.getTemplate().children?.[0].children?.[0].children?.[0].referenceData;
			expect(ReasonsForAbandoning).toEqual(ReferenceDataResourceType.TirReasonsForAbandoning);
		});
		it('should get the specialist reasons for abandoning', () => {
			const mockTestResult = { testTypes: [{ testTypeId: SPECIALIST_TEST_TYPE_IDS[0] }] } as TestResultSchema;
			fixture.componentRef.setInput('testResult', mockTestResult);
			const ReasonsForAbandoning = component.getTemplate().children?.[0].children?.[0].children?.[0].referenceData;
			expect(ReasonsForAbandoning).toEqual(ReferenceDataResourceType.SpecialistReasonsForAbandoning);
		});
		it('should get the reasons for regular reasons for abandoning by default', () => {
			const mockTestResult = { testTypes: [{ testTypeId: 'foobar' }] } as TestResultSchema;
			fixture.componentRef.setInput('testResult', mockTestResult);
			const ReasonsForAbandoning = component.getTemplate().children?.[0].children?.[0].children?.[0].referenceData;
			expect(ReasonsForAbandoning).toEqual(SpecialRefData.ReasonsForAbandoning);
		});
		it('should default to regular reasons for abandoning when there is no testResult', () => {
			const ReasonsForAbandoning = component.getTemplate().children?.[0].children?.[0].children?.[0].referenceData;
			expect(ReasonsForAbandoning).toEqual(SpecialRefData.ReasonsForAbandoning);
		});
		it('should build the reasonForAbandoning control with the expected shape', () => {
			const mockTestResult = { testTypes: [{ testTypeId: 'foobar' }] } as TestResultSchema;
			fixture.componentRef.setInput('testResult', mockTestResult);
			const reasonControl = component.getTemplate().children?.[0].children?.[0].children?.[0];
			expect(reasonControl?.name).toBe('reasonForAbandoning');
			expect(reasonControl?.required).toBe(true);
		});
	});

	describe('handleFormChange', () => {
		it('should emit the merged test result when the event has keys', () => {
			const mockTestResult = { vin: 'ABC123', testTypes: [{ testTypeId: 'foobar' }] } as TestResultSchema;
			fixture.componentRef.setInput('testResult', mockTestResult);

			const emitSpy = vi.spyOn(component.newTestResult, 'emit');
			component.handleFormChange({ abandonSection: { testTypes: [{ reasonForAbandoning: 'foo' }] } });

			expect(emitSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					vin: 'ABC123',
					abandonSection: { testTypes: [{ reasonForAbandoning: 'foo' }] },
				})
			);
		});

		it('should not emit when the merged result has no keys', () => {
			fixture.componentRef.setInput('testResult', undefined);

			const emitSpy = vi.spyOn(component.newTestResult, 'emit');
			component.handleFormChange({});

			expect(emitSpy).not.toHaveBeenCalled();
		});

		it('should emit even if testResult is undefined, provided the event has keys', () => {
			fixture.componentRef.setInput('testResult', undefined);

			const emitSpy = vi.spyOn(component.newTestResult, 'emit');
			component.handleFormChange({ foo: 'bar' });

			expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ foo: 'bar' }));
		});
	});

	describe('inherited BaseDialogComponent behaviour', () => {
		it('should emit the action output when handleAction is called', () => {
			const actionSpy = vi.spyOn(component.action, 'emit');
			component.handleAction('cancel');
			expect(actionSpy).toHaveBeenCalledWith('cancel');
		});
	});

	describe('dynamicFormGroup view child', () => {
		it('should resolve the DynamicFormGroupComponent view child', () => {
			expect(component.dynamicFormGroup()).toBeTruthy();
		});
	});
});


