import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { SPECIALIST_TEST_TYPE_IDS, TEST_TYPES_GROUP5_13 } from '@models/testTypeId.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { SpecialRefData } from '@services/multi-options/multi-options.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';

import { AbandonDialogComponent } from '../abandon-dialog.component';

describe('AbandonDialogComponent', () => {
	let component: AbandonDialogComponent;
	let fixture: ComponentFixture<AbandonDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AbandonDialogComponent],
			imports: [DynamicFormsModule, SharedModule, RouterTestingModule, HttpClientTestingModule],
			providers: [provideMockStore({ initialState: initialAppState }), DynamicFormService],
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

	describe('template getter', () => {
		it('should get the template with TIR reasons for abandoning if the testType is a TIR', () => {
			const mockTestResult = { testTypes: [{ testTypeId: TEST_TYPES_GROUP5_13[0] }] } as TestResultModel;
			component.testResult = mockTestResult;
			const ReasonsForAbandoning = component.getTemplate().children?.[0].children?.[0].children?.[0].referenceData;
			expect(ReasonsForAbandoning).toEqual(ReferenceDataResourceType.TirReasonsForAbandoning);
		});
		it('should get the specialist reasons for abandoning', () => {
			const mockTestResult = { testTypes: [{ testTypeId: SPECIALIST_TEST_TYPE_IDS[0] }] } as TestResultModel;
			component.testResult = mockTestResult;
			const ReasonsForAbandoning = component.getTemplate().children?.[0].children?.[0].children?.[0].referenceData;
			expect(ReasonsForAbandoning).toEqual(ReferenceDataResourceType.SpecialistReasonsForAbandoning);
		});
		it('should get the reasons for regular reasons for abandoning by default', () => {
			const mockTestResult = { testTypes: [{ testTypeId: 'foobar' }] } as TestResultModel;
			component.testResult = mockTestResult;
			const ReasonsForAbandoning = component.getTemplate().children?.[0].children?.[0].children?.[0].referenceData;
			expect(ReasonsForAbandoning).toEqual(SpecialRefData.ReasonsForAbandoning);
		});
	});
});
