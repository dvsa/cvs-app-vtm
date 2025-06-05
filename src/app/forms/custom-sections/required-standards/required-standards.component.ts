import { ViewportScroller } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { TagComponent } from '@components/tag/tag.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TestResultRequiredStandard } from '@models/test-results/test-result-required-standard.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Store, select } from '@ngrx/store';
import { TruncatePipe } from '@pipes/truncate/truncate.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { testResultInEdit } from '@store/test-records';
import { isEqual } from 'lodash';
import { Subject, Subscription, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
	selector: 'app-required-standards[template]',
	templateUrl: './required-standards.component.html',
	imports: [FormsModule, ReactiveFormsModule, RouterLink, TagComponent, ButtonComponent, TruncatePipe],
})
export class RequiredStandardsComponent implements OnInit, OnDestroy, OnChanges {
	dfs = inject(DynamicFormService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	viewportScroller = inject(ViewportScroller);
	globalErrorService = inject(GlobalErrorService);
	resultService = inject(ResultOfTestService);
	store = inject(Store);

	readonly isEditing = input(false);
	readonly template = input.required<FormNode>();
	readonly testData = input<Partial<TestResultModel>>({});

	readonly formChange = output<Record<string, any> | [][]>();
	readonly validateEuVehicleCategory = output();

	public form!: CustomFormGroup;
	private formSubscription = new Subscription();
	private requiredStandardsFormArray?: CustomFormArray;

	onDestroy$ = new Subject();

	ngOnInit(): void {
		this.form = this.dfs.createForm(this.template(), this.testData()) as CustomFormGroup;
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
		if (!this.testData()?.euVehicleCategory) {
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
