import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NoEmojisDirective } from '@directives/no-emojis/no-emojis.directive';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeByVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { SelectComponent } from '@forms/components/select/select.component';
import { MultiOptions } from '@models/options.model';
import { ReferenceDataResourceType, ReferenceDataTyre, ReferenceDataTyreLoadIndex } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TyreAxleLoadPipe } from '@pipes/tyre-axle-load/tyre-axle-load.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes, SearchParams } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { fetchReferenceDataByKeySearchSuccess, fetchTyreReferenceDataByKeySearchSuccess } from '@store/reference-data';
import { selectSearchReturn } from '@store/reference-data/reference-data.selectors';
import { TechnicalRecordServiceState } from '@store/technical-records/technical-record-service.reducer';
import { Observable, mergeMap, take } from 'rxjs';

@Component({
	selector: 'app-tyres-search',
	templateUrl: './tech-record-search-tyres.component.html',
	styleUrls: ['./tech-record-search-tyres.component.scss'],
	imports: [
		NumberPlateComponent,
		FormsModule,
		ReactiveFormsModule,
		SelectComponent,
		PaginationComponent,
		AsyncPipe,
		DefaultNullOrEmpty,
		TyreAxleLoadPipe,
		NoEmojisDirective,
	],
})
export class TechRecordSearchTyresComponent implements OnInit {
	cdr = inject(ChangeDetectorRef);
	dfs = inject(DynamicFormService);
	globalErrorService = inject(GlobalErrorService);
	referenceDataService = inject(ReferenceDataService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	technicalRecordService = inject(TechnicalRecordService);
	store = inject(Store<TechnicalRecordServiceState>);
	actions$ = inject(Actions);

	options?: MultiOptions = [
		{ label: 'Tyre code', value: 'code' },
		{ label: 'Ply rating', value: 'plyrating' },
		{ label: 'Single load index', value: 'singleload' },
		{ label: 'Double load index', value: 'doubleload' },
	];

	public form!: CustomFormGroup;
	public searchResults: Array<ReferenceDataTyre> | null = null;
	public vehicleTechRecord?: V3TechRecordModel;
	public viewableTechRecord?: TechRecordType<'hgv' | 'psv' | 'trl'>;
	private params: SearchParams = {};
	private pageStart?: number;
	private pageEnd?: number;
	public itemsPerPage = 10;

	public template: FormNode = {
		name: 'criteria',
		type: FormNodeTypes.GROUP,
		children: [
			{
				name: 'filter',
				label: 'Search filter',
				value: '',
				type: FormNodeTypes.CONTROL,
			},
			{
				name: 'term',
				value: '',
				type: FormNodeTypes.CONTROL,
			},
		],
	};

	loadIndex$ = this.referenceDataService.getAll$(ReferenceDataResourceType.TyreLoadIndex) as Observable<
		ReferenceDataTyreLoadIndex[]
	>;

	ngOnInit() {
		this.form = this.dfs.createForm(this.template) as CustomFormGroup;
		this.globalErrorService.clearErrors();
		this.route.params.pipe(take(1)).subscribe((p) => {
			this.params = p;
		});
		this.technicalRecordService.techRecord$.pipe(take(1)).subscribe((data) => {
			this.viewableTechRecord = data as TechRecordType<'hgv' | 'psv' | 'trl'>;
		});
		this.referenceDataService
			.getTyreSearchReturn$()
			.pipe(take(1))
			.subscribe((data) => {
				this.searchResults = data;
			});
		this.referenceDataService
			.getTyreSearchCriteria$()
			.pipe(take(1))
			.subscribe((v) => {
				this.form.controls['filter'].patchValue(v.filter);
				this.form.controls['term'].patchValue(v.term);
			});
		this.referenceDataService.loadReferenceData(ReferenceDataResourceType.TyreLoadIndex);
		if (!this.viewableTechRecord) {
			void this.router.navigate(['../..'], { relativeTo: this.route });
		}
		this.technicalRecordService.techRecord$.pipe(take(1)).subscribe((data) => {
			this.vehicleTechRecord = data;
		});
	}

	get roles() {
		return Roles;
	}
	get currentVrm(): string | undefined {
		return this.vehicleTechRecord?.techRecord_vehicleType !== 'trl'
			? (this.vehicleTechRecord?.primaryVrm ?? '')
			: undefined;
	}
	get paginatedFields(): ReferenceDataTyre[] {
		return this.searchResults?.slice(this.pageStart, this.pageEnd) ?? [];
	}
	get numberOfResults(): number {
		return this.searchResults?.length ?? 0;
	}

	handleSearch(filter: string, term: string): void {
		this.globalErrorService.clearErrors();
		this.searchResults = [];
		const trimmedTerm = term?.trim();
		if (!trimmedTerm || !filter) {
			const error = !trimmedTerm ? 'You must provide a search criteria' : 'You must select a valid search filter';
			this.globalErrorService.addError({ error, anchorLink: 'term' });
			return;
		}
		this.referenceDataService.addSearchInformation(filter, trimmedTerm);
		if (filter === 'code') {
			this.referenceDataService.loadReferenceDataByKeySearch(ReferenceDataResourceType.Tyres, trimmedTerm);
		} else {
			this.referenceDataService.loadTyreReferenceDataByKeySearch(filter, trimmedTerm);
		}

		this.actions$
			.pipe(
				ofType(fetchReferenceDataByKeySearchSuccess, fetchTyreReferenceDataByKeySearchSuccess),
				mergeMap(() => this.store.select(selectSearchReturn(ReferenceDataResourceType.Tyres))),
				take(1)
			)
			.subscribe((data) => {
				void this.router.navigate(['.'], { relativeTo: this.route, queryParams: { 'search-results-page': 1 } });
				this.searchResults = data as ReferenceDataTyre[];
			});
	}

	handleAddTyreToRecord(tyre: ReferenceDataTyre): void {
		const axleIndex = Number(this.params.axleNumber) - 1;
		if (this.viewableTechRecord && !this.viewableTechRecord.techRecord_axles) {
			this.viewableTechRecord.techRecord_axles = [];
		}
		if (this.viewableTechRecord?.techRecord_axles && !this.viewableTechRecord?.techRecord_axles?.[`${axleIndex}`]) {
			this.viewableTechRecord.techRecord_axles[`${axleIndex}`] = {};
		}

		if (this.viewableTechRecord?.techRecord_axles) {
			this.viewableTechRecord.techRecord_axles[`${axleIndex}`].tyres_tyreCode = Number(tyre.code);
			this.viewableTechRecord.techRecord_axles[`${axleIndex}`].tyres_tyreSize = tyre.tyreSize;
			this.viewableTechRecord.techRecord_axles[`${axleIndex}`].tyres_plyRating = tyre.plyRating;
			if (this.viewableTechRecord.techRecord_axles[`${axleIndex}`].tyres_fitmentCode) {
				// eslint-disable-next-line max-len
				this.viewableTechRecord.techRecord_axles[`${axleIndex}`].tyres_dataTrAxles =
					this.viewableTechRecord.techRecord_axles[`${axleIndex}`].tyres_fitmentCode === 'single'
						? Number.parseInt(tyre.loadIndexSingleLoad ?? '0', 10)
						: Number.parseInt(tyre.loadIndexTwinLoad ?? '0', 10);
			}
			this.technicalRecordService.updateEditingTechRecord(this.viewableTechRecord as TechRecordTypeByVerb<'put'>);
			void this.router.navigate(['../..'], { relativeTo: this.route });
		}
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}
	getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
		return errors.find((error) => error.anchorLink === name);
	}

	cancel() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['../..'], { relativeTo: this.route });
	}
}
