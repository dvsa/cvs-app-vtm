import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RequiredStandardsTpl } from '@forms/templates/general/required-standards.template';
import { INSPECTION_TYPE, TestResultRequiredStandard } from '@models/test-results/test-result-required-standard.model';
import { Store, select } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup } from '@services/dynamic-forms/dynamic-form.types';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { getRequiredStandardFromTypeAndRef } from '@store/required-standards/required-standards.selector';
import { selectRouteParam } from '@store/router/router.selectors';
import {
	createRequiredStandard,
	removeRequiredStandard,
	testResultInEdit,
	toEditOrNotToEdit,
	updateRequiredStandard,
} from '@store/test-records';
import { Subject, distinctUntilChanged, takeUntil, withLatestFrom } from 'rxjs';
import { ButtonGroupComponent } from '../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { TagComponent } from '../../../components/tag/tag.component';
import { DefaultNullOrEmpty as DefaultNullOrEmpty_1 } from '../../../pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TextAreaComponent } from '../../components/text-area/text-area.component';

@Component({
	selector: 'app-required-standard',
	templateUrl: './required-standard.component.html',
	providers: [DefaultNullOrEmpty],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgTemplateOutlet,
		TagComponent,
		FormsModule,
		ReactiveFormsModule,
		TextAreaComponent,
		ButtonGroupComponent,
		ButtonComponent,
		DefaultNullOrEmpty_1,
	],
})
export class RequiredStandardComponent implements OnInit, OnDestroy {
	form!: CustomFormGroup;
	index!: number;
	requiredStandard?: TestResultRequiredStandard;
	onDestroy$ = new Subject();
	isEditing: boolean;
	amendingRs?: boolean;

	private requiredStandardForm?: CustomFormArray;

	constructor(
		private store: Store,
		private activatedRoute: ActivatedRoute,
		private resultService: ResultOfTestService,
		private router: Router,
		private dfs: DynamicFormService,
		private errorService: GlobalErrorService
	) {
		this.isEditing = this.activatedRoute.snapshot.data['isEditing'];
	}

	ngOnInit(): void {
		const inspectionType = this.store.pipe(select(selectRouteParam('inspectionType')));
		const rsRefCalculation = this.store.pipe(select(selectRouteParam('ref')));
		const requiredStandardIndex = this.store.pipe(select(selectRouteParam('requiredStandardIndex')));

		this.store
			.pipe(select(this.isEditing ? testResultInEdit : toEditOrNotToEdit))
			.pipe(
				withLatestFrom(inspectionType, rsRefCalculation, requiredStandardIndex),
				takeUntil(this.onDestroy$),
				distinctUntilChanged((prev, curr) => prev[0]?.testTypes[0]?.testResult === curr[0]?.testTypes[0]?.testResult)
			)
			.subscribe(([testResult, inspectionTypeValue, rsRefCalculationValue, requiredStandardIndexValue]) => {
				if (!testResult) this.navigateBack();
				this.requiredStandardForm = (this.dfs.createForm(RequiredStandardsTpl, testResult) as CustomFormGroup).get([
					'testTypes',
					'0',
					'requiredStandards',
				]) as CustomFormArray;
				if (requiredStandardIndexValue) {
					this.amendingRs = true;
					this.index = Number(requiredStandardIndexValue);
					this.form = this.requiredStandardForm.controls[this.index] as CustomFormGroup;
					this.requiredStandard = testResult?.testTypes[0]?.requiredStandards?.at(this.index);
				} else {
					this.amendingRs = false;
					this.store
						.pipe(
							select(
								getRequiredStandardFromTypeAndRef(inspectionTypeValue as INSPECTION_TYPE, rsRefCalculationValue ?? '')
							),
							takeUntil(this.onDestroy$)
						)
						.subscribe((requiredStandard) => {
							if (!requiredStandard) this.navigateBack();
							const rsControl = {
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								...requiredStandard!,
								prs: false,
								additionalNotes: '',
							};

							this.requiredStandard = rsControl;
							this.requiredStandardForm?.addControl(rsControl);
							this.form = this.requiredStandardForm?.controls[
								this.index ?? this.requiredStandardForm.length - 1
							] as CustomFormGroup;
						});
				}
			});
	}

	ngOnDestroy(): void {
		this.onDestroy$.next(true);
		this.onDestroy$.complete();
	}

	navigateBack() {
		this.resultService.updateResultOfTestRequiredStandards();
		void this.router.navigate(this.amendingRs ? ['../../'] : ['../../../'], {
			relativeTo: this.activatedRoute,
			queryParamsHandling: 'preserve',
		});
	}

	toggleRsPrsField() {
		if (!this.requiredStandard) {
			return;
		}
		this.requiredStandard.prs = !this.requiredStandard.prs;
		this.requiredStandardForm?.controls[this.index ?? this.requiredStandardForm.length - 1]
			.get('prs')
			?.patchValue(this.requiredStandard.prs);
	}

	handleSubmit() {
		const errors: GlobalError[] = [];
		DynamicFormService.validate(this.form, errors);

		if (errors.length > 0) {
			this.errorService.setErrors(errors);
		}

		if (this.form.invalid) {
			return;
		}

		if (this.index || this.index === 0) {
			this.store.dispatch(
				updateRequiredStandard({
					requiredStandard: this.form.getCleanValue(this.form) as TestResultRequiredStandard,
					index: this.index,
				})
			);
		} else {
			this.store.dispatch(
				createRequiredStandard({ requiredStandard: this.form.getCleanValue(this.form) as TestResultRequiredStandard })
			);
		}
		this.navigateBack();
	}

	handleRemove() {
		this.store.dispatch(removeRequiredStandard({ index: this.index }));
		this.navigateBack();
	}
}
