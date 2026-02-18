import { KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpStatusCode } from '@angular/common/http';
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
import { DefectDetailsSchema, MediaSchema, VehicleType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { DefectsTpl } from '@forms/templates/general/defect.template';
import { Deficiency } from '@models/defects/deficiency.model';
import { RootRoutes } from '@models/routes.enum';
import { DeficiencyCategoryEnum } from '@models/test-results/test-result-defect.model';
import { Store, select } from '@ngrx/store';
import {
	DefaultNullOrEmpty,
	DefaultNullOrEmpty as DefaultNullOrEmpty_1,
} from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { DocumentsService } from '@services/documents/documents.service';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNodeOption } from '@services/dynamic-forms/dynamic-form.types';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { selectByDeficiencyRef, selectByImNumber } from '@store/defects';
import { State } from '@store/index';
import { selectRouteParam } from '@store/router/router.selectors';
import { createDefect, removeDefect, testResultInEdit, toEditOrNotToEdit, updateDefect } from '@store/test-records';
import JSZip from 'jszip';
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
	documentsService = inject(DocumentsService);
	globalErrorService = inject(GlobalErrorService);
	http = inject(HttpClient);
	cdr = inject(ChangeDetectorRef);
	defectMediaService = inject(DefectMediaService, { optional: true });

	form!: CustomFormGroup;
	index!: number;
	isEditing: boolean = this.activatedRoute.snapshot.data['isEditing'] ?? false;
	includeNotes = false;
	private vehicleType?: VehicleType;

	private defectsForm?: CustomFormArray;
	private defects?: DefectDetailsSchema[];
	defect?: DefectDetailsSchema;
	testResultId: string | undefined = undefined;

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

		if (this.defect && this.testResultId && this.defectMediaService) {
			await this.defectMediaService.loadImages(this.defect, this.testResultId);
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
		if (!file) {
			return;
		}
    // load image into a blob
		const fileData = await file.async('blob');

    // create a new zip to load image into it
		const newZip = new JSZip();
		newZip.file(media.path, fileData);

    // download zip
    await this.defectMediaService.openDocumentFromZip(newZip, this.defect)
	}

	async downloadAllMedia() {
		const testResultId = this.testResultId;
		if (!this.defectMediaService || !testResultId) {
			return;
		}
		this.defectMediaService.getPresignedUrlObserveValue(testResultId).subscribe({
			next: (response) => {
				switch (response.type) {
					case HttpEventType.DownloadProgress:
						break;
					case HttpEventType.Response:
						this.documentsService.openDocumentFromResponse(testResultId, response.body, 'zip');
						break;
					default:
						break;
				}
			},
			error: (error) => {
				if (error instanceof HttpErrorResponse) {
					switch (error.status) {
						case HttpStatusCode.NotFound:
							this.globalErrorService.setErrors([
								{
									error:
										'Media could not be found. <br>Try again later or contact the service desk if this issue keeps happening.',
									anchorLink: '',
								},
							]);
							break;
						case HttpStatusCode.InternalServerError:
							this.router.navigate([RootRoutes.ERROR]);
							break;
						default:
							// for sentry reporting
							console.error(error);
							break;
					}
				}
			},
		});
	}
}
