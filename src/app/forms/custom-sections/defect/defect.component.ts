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
import {
	DefectDetailsSchema,
	MediaSchema,
	TestResultSchema,
	VehicleType,
} from '@dvsa/cvs-type-definitions/types/v1/test-result';
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
import JSZip from 'jszip';
import { isEqual } from 'lodash';
import { Subject, filter, lastValueFrom, take, takeUntil, withLatestFrom } from 'rxjs';
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

		if (this.testResult && this.defectMediaService) {
			this.loading = true;
			await this.defectMediaService.loadImages(this.testResult);
			this.loading = false;
			this.cdr.detectChanges();
		}
	}

	ngOnDestroy(): void {
		this.onDestroy$.next(true);
		this.onDestroy$.complete();
	}

	srcValue(mediaSchema: MediaSchema): string {
		if (!this.defectMediaService) {
			return '';
		}
		const images = this.defectMediaService.getImages();
		const image = images[mediaSchema.path];
		return `data:image/jpg;base64,${image}`;
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
				updateDefect({ defect: this.form.getCleanValue(this.form) as DefectDetailsSchema, index: this.index })
			);
		} else {
			this.store.dispatch(createDefect({ defect: this.form.getCleanValue(this.form) as DefectDetailsSchema }));
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

	async downloadPhoto(media: MediaSchema) {
		try {
			if (!this.testResultId || !this.defectMediaService || !this.defect) {
				return;
			}
			const image = this.defectMediaService.getImage(media);
			if (image) {
				await this.downloadPhotoFromCache(image, media);
			} else {
				await this.downloadPhotoFromHttp(media);
			}
		} catch (error) {
			this.defectMediaService?.handleError(error);
			console.log(error);
		}
	}

	async downloadPhotoFromCache(image: string, media: MediaSchema) {
		if (!this.defectMediaService || !this.defect) {
			return;
		}

		// load response into zip file
		const zip = new JSZip();
		zip.file(media.path, image);
		await this.defectMediaService.openDocumentFromZip(zip, `${this.defect.imNumber}-${this.defect.imDescription}`);
	}

	async downloadPhotoFromHttp(media: MediaSchema) {
		if (!this.testResultId || !this.defectMediaService || !this.defect) {
			return;
		}
		// get presigned url
		const url = await lastValueFrom(this.defectMediaService.getPresignedUrlValue(this.testResultId));

		// get zip file for test result id
		const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));

		// load response into zip file
		const zip = new JSZip();
		await zip.loadAsync(blob, { base64: true });

		// load image into a file
		const file = zip.file(media.path);
		if (file) {
			// load image into a blob
			const fileData = await file.async('blob');

			// create a new zip to load image into it
			const newZip = new JSZip();
			newZip.file(media.path, fileData);

			// download zip
			await this.defectMediaService.openDocumentFromZip(newZip, `${this.defect.imNumber}-${this.defect.imDescription}`);
		}
	}

	async downloadAllMedia() {
		try {
			const testResultId = this.testResultId;
			if (!this.defectMediaService || !testResultId || !this.defect) {
				return;
			}
			if (this.defectMediaService.hasCachedImages(this.defect)) {
				await this.downloadAllMediaFromCache();
			} else {
				await this.downloadAllMediaFromHttp();
			}
		} catch (error) {
			this.defectMediaService?.handleError(error);
			console.log(error);
		}
	}

	async downloadAllMediaFromCache() {
		const testResultId = this.testResultId;
		if (!this.defectMediaService || !this.defect || !testResultId || !this.defect.media) {
			return;
		}
		// download images from cache
		const zip = new JSZip();
		const defectMedia = this.defect.media;
		for (const image of defectMedia) {
			const file = this.defectMediaService.images[image.path];
			if (file) {
				zip.file(image.path, file);
			}
		}
		await this.defectMediaService.openDocumentFromZip(zip, testResultId);
	}

	async downloadAllMediaFromHttp() {
		const testResultId = this.testResultId;
		if (!this.defectMediaService || !this.defect || !testResultId || !this.defect.media) {
			return;
		}
		// get presigned url
		const url = await lastValueFrom(this.defectMediaService.getPresignedUrlValue(testResultId));

		// get zip file for test result id
		const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));

		// load response into zip file
		const zip = new JSZip();
		await zip.loadAsync(blob, { base64: true });

		// check media exists
		const media = this.defect.media;
		if (media && this.defectMediaService.hasImages(this.defect)) {
			// load media into zip file
			const zip = new JSZip();
			await zip.loadAsync(blob);

			// create zip to hold defect specific images
			const newZip = new JSZip();

			// loop through media
			for (const mediaObject of media) {
				const file = zip.files[mediaObject.path];
				if (file) {
					// if file exists add to zip file and add image to cache
					const fileData = await file.async('blob');
					this.defectMediaService.images[mediaObject.path] = await file.async('base64');
					newZip.file(mediaObject.path, fileData);
				}
			}
			// download zip
			await this.defectMediaService.openDocumentFromZip(newZip, `${this.defect.imNumber}-${this.defect.imDescription}`);
		}
	}

	protected readonly isEqual = isEqual;
}
