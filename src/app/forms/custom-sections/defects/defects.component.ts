import { HttpClient, HttpErrorResponse, HttpEventType, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Signal, inject, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { DefectMediaDownloadComponent } from '@components/defect-media-download/defect-media-download.component';
import { TagComponent } from '@components/tag/tag.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { RootRoutes } from '@models/routes.enum';
import { Store } from '@ngrx/store';
import { TruncatePipe } from '@pipes/truncate/truncate.pipe';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { DocumentsService } from '@services/documents/documents.service';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { selectedTestResultState } from '@store/test-records';
import JSZip from 'jszip';
import { Subscription, debounceTime } from 'rxjs';

@Component({
	selector: 'app-defects[defects][template]',
	templateUrl: './defects.component.html',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		RouterLink,
		TagComponent,
		ButtonComponent,
		TruncatePipe,
		DefectMediaDownloadComponent,
	],
})
export class DefectsComponent implements OnInit, OnDestroy {
	dfs = inject(DynamicFormService);
	http = inject(HttpClient);
	store = inject(Store);
	documentsService = inject(DocumentsService);
	router = inject(Router);
	globalErrorService = inject(GlobalErrorService);
	defectMediaService = inject(DefectMediaService, { optional: true });

	readonly isEditing = input(false);
	readonly defects = input.required<DefectCategoryReferenceDataSchema[] | null>();
	readonly template = input.required<FormNode>();
	readonly data = input<Partial<TestResultSchema>>({});
	testResult = this.store.selectSignal(selectedTestResultState) as Signal<TestResultSchema | undefined>;

	readonly formChange = output<Record<string, any> | [][]>();

	public form!: CustomFormGroup;
	private formSubscription = new Subscription();
	private defectsFormArray?: CustomFormArray;

	ngOnInit(): void {
		this.form = this.dfs.createForm(this.template(), this.data()) as CustomFormGroup;
		this.formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event) => {
			this.formChange.emit(event);
		});
	}

	ngOnDestroy(): void {
		this.formSubscription.unsubscribe();
	}

	hasMediaAvailable(): boolean {
		// return true if one of the defects contains media which are images
		for (const defect of this.testDefects) {
			if (defect.media) {
				const hasImages = defect.media.some((media) => media.type !== 'failReason');
				if (hasImages) {
					return true;
				}
			}
		}
		return false;
	}

	async downloadAllMedia() {
		const testResult = this.testResult();
		if (!testResult || !this.defectMediaService) {
			return;
		}
		const testResultId = testResult.testResultId;

		if (this.defectMediaService.hasCachedTestResultImages(testResult)) {
			console.log('retrieving from cache');
			// download images from cache
			const zip = new JSZip();
			for (const defect of testResult.testTypes[0].defects) {
				const defectMedia = defect.media;
				if (!defectMedia) {
					return;
				}
				for (const image of defectMedia) {
					const file = this.defectMediaService.images[image.path];
					if (file) {
						zip.file(image.path, file);
					}
				}
			}
			await this.defectMediaService.openDocumentFromZip(zip, testResultId);
			return;
		}

		console.log('retrieving from http');

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

	get defectsForm(): CustomFormArray {
		if (!this.defectsFormArray) {
			this.defectsFormArray = this.form?.get(['testTypes', '0', 'defects']) as CustomFormArray;
		}
		return this.defectsFormArray;
	}

	get defectCount(): number {
		return this.defectsForm?.controls.length;
	}

	get testDefects(): DefectDetailsSchema[] {
		return this.defectsForm.controls.map((control) => {
			const formGroup = control as CustomFormGroup;
			return formGroup.getCleanValue(formGroup) as DefectDetailsSchema;
		});
	}

	categoryColor(category: string): string {
		return categoryColors[category as keyof typeof categoryColors];
	}
}

const categoryColors = {
	major: 'orange',
	minor: 'yellow',
	dangerous: 'red',
	advisory: 'blue',
} as const;
