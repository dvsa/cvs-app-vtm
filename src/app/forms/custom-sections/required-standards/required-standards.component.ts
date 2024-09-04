import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { TestResultRequiredStandard } from '@models/test-results/test-result-required-standard.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Store, select } from '@ngrx/store';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { testResultInEdit } from '@store/test-records';
import { isEqual } from 'lodash';
import { Subject, Subscription, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
	selector: 'app-required-standards[template]',
	templateUrl: './required-standards.component.html',
})
export class RequiredStandardsComponent implements OnInit, OnDestroy, OnChanges {
	@Input() isEditing = false;
	@Input() template!: FormNode;
	@Input() testData: Partial<TestResultModel> = {};

	@Output() formChange = new EventEmitter();
	@Output() validateEuVehicleCategory = new EventEmitter();

	public form!: CustomFormGroup;
	private formSubscription = new Subscription();
	private requiredStandardsFormArray?: CustomFormArray;

	onDestroy$ = new Subject();

	constructor(
		private dfs: DynamicFormService,
		private router: Router,
		private route: ActivatedRoute,
		private viewportScroller: ViewportScroller,
		private globalErrorService: GlobalErrorService,
		private resultService: ResultOfTestService,
		private store: Store
	) {}

	ngOnInit(): void {
		this.form = this.dfs.createForm(this.template, this.testData) as CustomFormGroup;
		this.formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event) => {
			this.formChange.emit(event);
		});
		this.store
			.pipe(select(testResultInEdit))
			.pipe(
				takeUntil(this.onDestroy$),
				distinctUntilChanged((prev, curr) =>
					isEqual(prev?.testTypes?.at(0)?.requiredStandards, curr?.testTypes?.at(0)?.requiredStandards)
				)
			)
			.subscribe(() => {
				this.resultService.updateResultOfTestRequiredStandards();
			});
	}

	ngOnDestroy(): void {
		this.formSubscription.unsubscribe();
	}

	ngOnChanges(changes: SimpleChanges): void {
		const { testData } = changes;

		if (testData?.currentValue?.euVehicleCategory !== testData?.previousValue?.euVehicleCategory) {
			this.form?.get(['testTypes', '0', 'requiredStandards'])?.patchValue([], { emitEvent: true });
		}
	}

	onAddRequiredStandard(): void {
		this.globalErrorService.clearErrors();
		if (!this.testData?.euVehicleCategory) {
			this.validateEuVehicleCategory.emit();
			this.viewportScroller.scrollToPosition([0, 0]);
			return;
		}
		void this.router.navigate(['selectRequiredStandard'], { queryParamsHandling: 'preserve', relativeTo: this.route });
	}

	get requiredStandardsForm(): CustomFormArray {
		if (!this.requiredStandardsFormArray) {
			this.requiredStandardsFormArray = this.form?.get(['testTypes', '0', 'requiredStandards']) as CustomFormArray;
		}
		return this.requiredStandardsFormArray;
	}

	get requiredStandardsCount(): number {
		return this.requiredStandardsForm?.controls.length;
	}

	get testRequiredStandards(): TestResultRequiredStandard[] {
		return this.requiredStandardsForm.controls.map((control) => {
			const formGroup = control as CustomFormGroup;
			return formGroup.getCleanValue(formGroup) as TestResultRequiredStandard;
		});
	}
}
