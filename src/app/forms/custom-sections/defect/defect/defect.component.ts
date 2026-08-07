import { KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { TagComponent } from '@components/tag/tag.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import {
	DefectCategoryReferenceDataSchema,
	DefectItemReferenceDataSchema,
} from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { DefectAdditionalDetailsMetadataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-details';
import { DefectDetailsSchema, TestResultSchema, VehicleType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { DefectsTpl } from '@forms/templates/general/defect.template';
import { Deficiency } from '@models/defects/deficiency.model';
import { DeficiencyCategoryEnum } from '@models/test-results/test-result-defect.model';
import { Store, select } from '@ngrx/store';
import {
	DefaultNullOrEmpty,
	DefaultNullOrEmpty as DefaultNullOrEmpty_1,
} from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNodeOption } from '@services/dynamic-forms/dynamic-form.types';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { selectByDeficiencyRef, selectByImNumber } from '@store/defects';
import { State } from '@store/index';
import { selectRouteParam } from '@store/router/router.selectors';
import { createDefect, removeDefect, testResultInEdit, toEditOrNotToEdit, updateDefect } from '@store/test-records';
import { Subject, filter, take, takeUntil, withLatestFrom } from 'rxjs';
import { RadioGroupComponent } from '../../../components/radio-group/radio-group.component';
import { SelectComponent } from '../../../components/select/select.component';
import { TextAreaComponent } from '../../../components/text-area/text-area.component';

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
	activatedRoute = inject(ActivatedRoute);
	dfs = inject(DynamicFormService);
	router = inject(Router);
	store = inject(Store<State>);
	resultService = inject(ResultOfTestService);
	errorService = inject(GlobalErrorService);
	globalErrorService = inject(GlobalErrorService);
	http = inject(HttpClient);
	cdr = inject(ChangeDetectorRef);
	defectMediaService = inject(DefectMediaService, { optional: true });

	form!: CustomFormGroup;
	index!: number;
	isEditing: boolean = this.activatedRoute.snapshot.data['isEditing'] ?? false;
	includeNotes = false;
	loading = false;
	private vehicleType?: VehicleType;

	private defectsForm?: CustomFormArray;
	private defects?: DefectDetailsSchema[];
	defect?: DefectDetailsSchema;
	testResultId: string | undefined = undefined;
	testResult: TestResultSchema | undefined = undefined;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	infoDictionary: Record<string, Array<FormNodeOption<any>>> = {};
	onDestroy$ = new Subject();

	booleanOptions: FormNodeOption<string | number | boolean>[] = [
		{ value: true, label: 'Yes' },
		{ value: false, label: 'No' },
	];
	isVideoPlaying = false;

	async ngOnInit(): Promise<void> {
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
				this.testResult = testResult;
				this.defects = testResult?.testTypes[0].defects;
				this.testResultId = testResult?.testResultId;
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
							this.initializeDefect(
								defect as DefectCategoryReferenceDataSchema,
								item as DefectItemReferenceDataSchema,
								deficiency as Deficiency
							);
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

		await this.loadMediaItems();
	}

	ngOnDestroy(): void {
		this.onDestroy$.next(true);
		this.onDestroy$.complete();
	}

	async loadMediaItems() {
		if (!this.testResult || !this.defect || !this.defectMediaService) return;

		try {
			this.loading = true;

			if (this.defectMediaService.canDownloadAdasMediaItems(this.defect)) {
				await this.defectMediaService.getAdasZip(this.testResult.testResultId);
			}

			if (this.defectMediaService.canDownloadDefectMediaItems(this.defect)) {
				await this.defectMediaService.getDefectZip(this.testResult.testResultId);
			}

			if (Array.isArray(this.defect.media)) {
				for (const media of this.defect.media) {
					await this.defectMediaService.loadMediaItemAsBase64(this.testResult, this.defect, media);
				}
			}
		} catch (error) {
			this.defectMediaService.handleError(error, this.testResult.testResultId);
		} finally {
			this.loading = false;
			this.cdr.detectChanges();
		}
	}

	getFailureToCaptureDefectMediaReason(): string {
		if (!this.defect?.media) {
			return 'No media available';
		}

		if (!this.defectMediaService?.hasMediaInCache(this.defect)) {
			return 'Media could not be found';
		}

		for (const reason of this.defect.media) {
			if (reason.type === 'failReason') {
				const formattedReason = this.defectMediaService?.formatMediaFailureReason(reason.reason) ?? reason.reason;
				return `No media available - ${formattedReason}`;
			}
		}

		// Check for HTTP errors (404 or 500) when fetching media
		if (this.testResult) {
			const mediaError = this.defectMediaService?.getMediaFetchError(this.testResult.testResultId);
			if (mediaError) {
				return mediaError.message;
			}
		}

		return 'No media available';
	}

	async playVideo(mediaPath: string): Promise<void> {
		this.isVideoPlaying = true;
		this.cdr.detectChanges();
		const video = this.getVideoElement(mediaPath);
		if (!video) {
			this.isVideoPlaying = false;
			return;
		}
		await video.play();
	}

	private getVideoElement(mediaPath: string): HTMLVideoElement | null {
		const element = document.querySelector(`video[data-media-path="${mediaPath}"]`);
		return element ? (element as HTMLVideoElement) : null;
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
			const defect = this.form.getCleanValue(this.form) as DefectDetailsSchema;
			if (this.isDangerous || defect.imNumber === 29) {
				defect.media =
					Array.isArray(defect.media) && defect.media.length > 0
						? defect.media
						: [{ type: 'failReason', reason: 'Contingency test', path: ' ' }];
			}
			this.store.dispatch(updateDefect({ defect: defect, index: this.index }));
		} else {
			const defect = this.form.getCleanValue(this.form) as DefectDetailsSchema;
			if (this.isDangerous || defect.imNumber === 29) {
				defect.media =
					Array.isArray(defect.media) && defect.media.length > 0
						? defect.media
						: [{ type: 'failReason', reason: 'Contingency test', path: ' ' }];
			}
			this.store.dispatch(createDefect({ defect: defect }));
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

	toggleDefectField(field: keyof DefectDetailsSchema) {
		if (!this.defect) {
			return;
		}
		this.defect = { ...this.defect, [field]: !this.defect[`${field}`] } as DefectDetailsSchema;
		this.defectsForm?.controls[this.index ?? this.defectsForm.length - 1]
			.get(field)
			?.patchValue(this.defect[`${field}`]);
	}

	initializeInfoDictionary(defect: DefectCategoryReferenceDataSchema | undefined) {
		const infoShorthand = defect?.additionalInfo;

		const info = defect?.additionalInfo[this.vehicleType as keyof typeof infoShorthand] as
			| DefectAdditionalDetailsMetadataSchema
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

	initializeDefect(
		defect: DefectCategoryReferenceDataSchema,
		item: DefectItemReferenceDataSchema,
		deficiency: Deficiency
	) {
		const testResultDefect = {
			imDescription: defect.imDescription,
			imNumber: defect.imNumber,

			itemDescription: item.itemDescription,
			itemNumber: item.itemNumber,

			// initializing if defect is advisory
			deficiencyCategory: DeficiencyCategoryEnum.Advisory,
			deficiencyRef: `${defect.imNumber}.${item.itemNumber}`,
			prohibitionIssued: false,
			stdForProhibition: false,
		} as DefectDetailsSchema;

		if (deficiency) {
			testResultDefect.deficiencyCategory = deficiency.deficiencyCategory;
			testResultDefect.deficiencyId = deficiency.deficiencyId;
			testResultDefect.deficiencySubId = deficiency.deficiencySubId;
			testResultDefect.deficiencyText = deficiency.deficiencyText;
			testResultDefect.deficiencyRef = deficiency.ref;
			testResultDefect.stdForProhibition = deficiency.stdForProhibition;
		} else if (item.itemDescription?.endsWith(':')) {
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
