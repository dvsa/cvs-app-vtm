import { KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectsTpl } from '@forms/templates/general/defect.template';
import { AdditionalInfoSection } from '@models/defects/additional-information.model';
import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { DeficiencyCategoryEnum, TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultDefects } from '@models/test-results/test-result-defects.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNodeOption } from '@services/dynamic-forms/dynamic-form.types';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { selectByDeficiencyRef, selectByImNumber } from '@store/defects';
import { State } from '@store/index';
import { selectRouteParam } from '@store/router/router.selectors';
import { createDefect, removeDefect, testResultInEdit, toEditOrNotToEdit, updateDefect } from '@store/test-records';
import { Subject, filter, take, takeUntil, withLatestFrom } from 'rxjs';
import { ButtonGroupComponent } from '../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { TagComponent } from '../../../components/tag/tag.component';
import { DefaultNullOrEmpty as DefaultNullOrEmpty_1 } from '../../../pipes/default-null-or-empty/default-null-or-empty.pipe';
import { RadioGroupComponent } from '../../components/radio-group/radio-group.component';
import { SelectComponent } from '../../components/select/select.component';
import { TextAreaComponent } from '../../components/text-area/text-area.component';

@Component({
	selector: 'app-defect',
	templateUrl: './defect.component.html',
	styleUrls: ['./defect.component.scss'],
	providers: [DefaultNullOrEmpty],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgTemplateOutlet,
		TagComponent,
		FormsModule,
		ReactiveFormsModule,
		RadioGroupComponent,
		SelectComponent,
		TextAreaComponent,
		ButtonGroupComponent,
		ButtonComponent,
		KeyValuePipe,
		DefaultNullOrEmpty_1,
	],
})
export class DefectComponent implements OnInit, OnDestroy {
	form!: CustomFormGroup;
	index!: number;
	isEditing: boolean;
	includeNotes = false;
	private vehicleType?: VehicleTypes;

	private defectsForm?: CustomFormArray;
	private defects?: TestResultDefects;
	defect?: TestResultDefect;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	infoDictionary: Record<string, Array<FormNodeOption<any>>> = {};
	onDestroy$ = new Subject();

	booleanOptions: FormNodeOption<string | number | boolean>[] = [
		{ value: true, label: 'Yes' },
		{ value: false, label: 'No' },
	];

	constructor(
		private activatedRoute: ActivatedRoute,
		private dfs: DynamicFormService,
		private router: Router,
		private store: Store<State>,
		private resultService: ResultOfTestService,
		private errorService: GlobalErrorService
	) {
		this.isEditing = this.activatedRoute.snapshot.data['isEditing'];
	}

	ngOnInit(): void {
		const defectIndex = this.store.pipe(select(selectRouteParam('defectIndex')));
		const defectRef = this.store.pipe(select(selectRouteParam('ref')));

		this.store
			.select(this.isEditing ? testResultInEdit : toEditOrNotToEdit)
			.pipe(
				withLatestFrom(defectIndex, defectRef),
				takeUntil(this.onDestroy$),
				filter(([testResult]) => !!testResult)
			)
			.subscribe(([testResult, defectIndexValue, defectRefValue]) => {
				if (!testResult) this.navigateBack();
				this.defects = testResult?.testTypes[0].defects;
				this.vehicleType = testResult?.vehicleType;
				this.defectsForm = (this.dfs.createForm(DefectsTpl, testResult) as CustomFormGroup).get([
					'testTypes',
					'0',
					'defects',
				]) as CustomFormArray;
				if (defectIndexValue) {
					this.index = Number(defectIndexValue);
					this.form = this.defectsForm.controls[this.index] as CustomFormGroup;
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.defect = this.defects![this.index];
				} else if (defectRefValue && this.vehicleType) {
					this.store
						.select(selectByDeficiencyRef(defectRefValue, this.vehicleType))
						.pipe(take(1))
						.subscribe(([defect, item, deficiency]) => {
							this.initializeDefect(defect as Defect, item as Item, deficiency as Deficiency);
						});
				}
			});

		if (!this.defect) this.navigateBack();

		if (this.vehicleType) {
			this.store
				.select(selectByImNumber(this.defect?.imNumber || Number.NaN, this.vehicleType))
				.pipe(
					takeUntil(this.onDestroy$),
					filter((d) => !!d)
				)
				.subscribe((defectsTaxonomy) => {
					this.initializeInfoDictionary(defectsTaxonomy);
				});
		}
	}

	ngOnDestroy(): void {
		this.onDestroy$.next(true);
		this.onDestroy$.complete();
	}

	get isDangerous(): boolean {
		return this.defect?.deficiencyCategory === 'dangerous';
	}

	get isAdvisory(): boolean {
		return this.defect?.deficiencyCategory === 'advisory';
	}

	get isDangerousAsterisk(): boolean {
		return this.defect?.stdForProhibition === true;
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
				updateDefect({ defect: this.form.getCleanValue(this.form) as TestResultDefect, index: this.index })
			);
		} else {
			this.store.dispatch(createDefect({ defect: this.form.getCleanValue(this.form) as TestResultDefect }));
		}

		this.navigateBack();
	}

	handleRemove() {
		this.store.dispatch(removeDefect({ index: this.index }));
		this.navigateBack();
	}

	navigateBack() {
		this.resultService.updateResultOfTest();
		void this.router.navigate(['../..'], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
	}

	toggleDefectField(field: keyof TestResultDefect) {
		if (!this.defect) {
			return;
		}
		this.defect = { ...this.defect, [field]: !this.defect[`${field}`] } as TestResultDefect;
		this.defectsForm?.controls[this.index ?? this.defectsForm.length - 1]
			.get(field)
			?.patchValue(this.defect[`${field}`]);
	}

	initializeInfoDictionary(defect: Defect | undefined) {
		const infoShorthand = defect?.additionalInfo;

		const info = defect?.additionalInfo[this.vehicleType as keyof typeof infoShorthand] as
			| AdditionalInfoSection
			| undefined;

		this.includeNotes = !!info?.notes;

		if (info) {
			type LocationKey = keyof typeof info.location;

			Object.keys(info.location).forEach((key) => {
				const options = info?.location[key as LocationKey];
				if (options) {
					this.infoDictionary[`${key}`] = this.mapOptions(options);
				}
			});
		}
	}

	initializeDefect(defect: Defect, item: Item, deficiency: Deficiency) {
		const testResultDefect: TestResultDefect = {
			imDescription: defect.imDescription,
			imNumber: defect.imNumber,

			itemDescription: item.itemDescription,
			itemNumber: item.itemNumber,

			// initializing if defect is advisory
			deficiencyCategory: DeficiencyCategoryEnum.Advisory,
			deficiencyRef: `${defect.imNumber}.${item.itemNumber}`,
			prohibitionIssued: false,
			stdForProhibition: false,
		};

		if (deficiency) {
			testResultDefect.deficiencyCategory = deficiency.deficiencyCategory;
			testResultDefect.deficiencyId = deficiency.deficiencyId;
			testResultDefect.deficiencySubId = deficiency.deficiencySubId;
			testResultDefect.deficiencyText = deficiency.deficiencyText;
			testResultDefect.deficiencyRef = deficiency.ref;
			testResultDefect.stdForProhibition = deficiency.stdForProhibition;
		} else if (item.itemDescription.endsWith(':')) {
			testResultDefect.itemDescription = item.itemDescription.slice(0, -1);
		}

		this.defectsForm?.addControl(testResultDefect);
		this.form = this.defectsForm?.controls[this.defectsForm.length - 1] as CustomFormGroup;
		this.defect = testResultDefect;
	}

	categoryColor(category = 'major'): 'red' | 'orange' | 'yellow' | 'green' | 'blue' {
		return (<Record<string, 'red' | 'orange' | 'green' | 'yellow' | 'blue'>>{
			major: 'orange',
			minor: 'yellow',
			dangerous: 'red',
			advisory: 'blue',
		})[`${category}`];
	}

	mapOptions = (options: Array<unknown>): Array<FormNodeOption<unknown>> =>
		options.map((option) => ({ value: option, label: this.pascalCase(String(option)) }));

	pascalCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');
}
