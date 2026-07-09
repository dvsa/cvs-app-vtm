import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerComponent } from '@components/banner/banner.component';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Roles } from '@models/roles.enum';
import { TestModeEnum } from '@models/test-results/test-result-view.enum';
import { Actions, ofType } from '@ngrx/effects';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { updateTestResultSuccess } from '@store/test-records';
import cloneDeep from 'lodash.clonedeep';
import { Observable, Subject, combineLatest, filter, firstValueFrom, map, of, switchMap, take, takeUntil } from 'rxjs';
import { BaseTestRecordComponent } from '../../../../components/base-test-record/base-test-record.component';
import { VehicleHeaderComponent } from '../../../../components/vehicle-header/vehicle-header.component';

@Component({
	selector: 'app-test-records',
	templateUrl: './test-record.component.html',
	imports: [
		BannerComponent,
		BaseTestRecordComponent,
		RoleRequiredDirective,
		ButtonGroupComponent,
		ButtonComponent,
		VehicleHeaderComponent,
		AsyncPipe,
	],
})
export class TestRecordComponent implements OnInit, OnDestroy {
	actions$ = inject(Actions);
	errorService = inject(GlobalErrorService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	routerService = inject(RouterService);
	titleService = inject(Title);
	testRecordsService = inject(TestRecordsService);

	readonly baseTestRecordComponent = viewChild(BaseTestRecordComponent);

	private destroy$ = new Subject<void>();

	testResult$: Observable<TestResultSchema | undefined> = of(undefined);
	sectionTemplates$: Observable<FormNode[] | undefined> = of(undefined);
	testMode = TestModeEnum.Edit;
	testNumber$ = this.routerService.routeNestedParams$.pipe(map((params) => params['testNumber']));

	ngOnInit(): void {
		this.testResult$ = this.testRecordsService.editingTestResult$.pipe(
			switchMap((editingTestResult) =>
				editingTestResult ? of(editingTestResult) : this.testRecordsService.testResult$
			)
		);
		this.sectionTemplates$ = this.testRecordsService.sectionTemplates$;

		this.actions$.pipe(ofType(updateTestResultSuccess), takeUntil(this.destroy$)).subscribe(() => {
			void this.router.navigate(['../..'], { relativeTo: this.route.parent });
		});

		combineLatest([
			this.testResult$,
			this.routerService.getQueryParam$('testType'),
			this.testRecordsService.sectionTemplates$,
		])
			.pipe(
				take(1),
				filter(([testResult]) => !!testResult)
			)
			.subscribe(([testResult, testType, sectionTemplates]) => {
				if (!sectionTemplates && testResult) {
					testResult.reasonForCreation = '';
					this.testRecordsService.editingTestResult(testResult);
				}
				if (testType && testType !== testResult?.testTypes[0].testTypeId) {
					// @ts-ignore
					this.testRecordsService.testTypeChange(testType);
				}
			});
	}

	ngOnDestroy(): void {
		this.errorService.clearErrors();

		this.destroy$.next();
		this.destroy$.complete();
	}

	public get Roles() {
		return Roles;
	}

	/**
	 * Merge all section form values into one testResult and trigger action to update testResult.
	 * @returns void
	 */
	async handleSave(): Promise<void> {
		if (await this.hasErrors()) {
			return;
		}

		this.testRecordsService.cleanTestResult();

		const testResult = await firstValueFrom(this.testResult$);
		const testResultClone = cloneDeep(testResult) as TestResultSchema;
		const defects = testResultClone.testTypes[0].defects;
		if (Array.isArray(defects) && defects.length > 0) {
			for (const defect of defects) {
				if (!defect.media) {
					defect.media = [{ type: 'failReason', path: ' ', reason: 'Contingency test' }];
				}
			}
		}

		this.testRecordsService.updateTestResult(testResultClone);
	}

	async handleReview(): Promise<void> {
		if (await this.hasErrors()) {
			return;
		}

		this.testMode = TestModeEnum.View;
		this.titleService.setTitle('Check test details - Vehicle Testing Management');
	}

	async hasErrors(): Promise<boolean> {
		const errors: GlobalError[] = [];
		const forms = [];

		const baseTestRecordComponent = this.baseTestRecordComponent();
		if (baseTestRecordComponent) {
			const {
				sections: sectionsInput,
				defects: defectsInput,
				customDefects: customDefectsInput,
			} = baseTestRecordComponent;
			const sections = sectionsInput();
			const defects = defectsInput();
			const customDefects = customDefectsInput();

			if (sections) {
				sections.forEach((section) => {
					forms.push(section.form);
				});
			}

			if (defects) {
				forms.push(defects.form);
			}

			if (customDefects) {
				forms.push(customDefects.form);
			}
		}

		// if all forms are not marked as dirty, return
		if (!this.isAnyFormDirty(forms) && (await firstValueFrom(this.testRecordsService.isSameTestTypeId$))) {
			return true;
		}

		forms.forEach((form) => {
			DynamicFormService.validate(form, errors);
		});

		const customForms = [baseTestRecordComponent?.loadStatus(), baseTestRecordComponent?.weights()];

		customForms.forEach((form) => {
			if (form) {
				this.errorService.markAllAsTouched(form.form);
				errors.push(...this.errorService.extractGlobalErrors(form.form));
			}
		});

		if (errors.length > 0) {
			this.errorService.setErrors(errors);
		}

		return this.isAnyFormInvalid(forms) || customForms.some((form) => form?.form.invalid);
	}

	handleCancel() {
		this.testMode =
			this.testMode === TestModeEnum.Cancel || this.testMode === TestModeEnum.View
				? TestModeEnum.Edit
				: TestModeEnum.Cancel;
		if (this.testMode === TestModeEnum.Edit) {
			this.titleService.setTitle('Amend test details - Vehicle Testing Management');
		}
	}

	handleConfirmCancel() {
		void this.router.navigate(['../..'], { relativeTo: this.route.parent });
	}

	get isTestTypeGroupEditable$(): Observable<boolean> {
		return this.testRecordsService.isTestTypeGroupEditable$;
	}

	handleNewTestResult(testResult: TestResultSchema) {
		this.testRecordsService.updateEditingTestResult(testResult);
	}

	isAnyFormDirty(forms: Array<FormGroup>) {
		return forms.some((form) => form.dirty);
	}

	isAnyFormInvalid(forms: Array<FormGroup>) {
		return forms.some((form) => form.invalid);
	}

	public get TestModeEnum(): typeof TestModeEnum {
		return TestModeEnum;
	}
}
