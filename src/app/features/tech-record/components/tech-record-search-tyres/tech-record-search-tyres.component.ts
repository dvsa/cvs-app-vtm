import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CustomFormGroup, FormNode, FormNodeTypes, Params } from '@forms/services/dynamic-form.types';
import { cloneDeep } from 'lodash';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { mergeMap, take } from 'rxjs';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { fetchReferenceDataByKeySearchSuccess, fetchTyreReferenceDataByKeySearchSuccess } from '@store/reference-data';
import { Store } from '@ngrx/store';
import { selectTyreSearchReturn } from '@store/reference-data/selectors/reference-data.selectors';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { VehicleTechRecordModel, TechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-tyres-search',
  templateUrl: './tech-record-search-tyres.component.html',
  styleUrls: ['./tech-record-search-tyres.component.scss']
})
export class TechRecordSearchTyresComponent implements OnInit {
  options?: MultiOptions = [
    { label: 'Tyre code', value: 'code' },
    { label: 'Ply rating', value: 'plyrating' },
    { label: 'Single load index', value: 'singleload' },
    { label: 'Double load index', value: 'doubleload' }
  ];

  constructor(
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public dfs: DynamicFormService,
    public globalErrorService: GlobalErrorService,
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    private technicalRecordService: TechnicalRecordService,
    private store: Store<TechnicalRecordServiceState>,
    private actions$: Actions
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(data => (this.vehicleTechRecord = data));
  }

  public form!: CustomFormGroup;
  public searchResults: Array<ReferenceDataTyre> | null = null;
  public vehicleTechRecord?: VehicleTechRecordModel;
  public viewableTechRecord: TechRecordModel | undefined = undefined;
  private params: Params = {};
  private pageStart?: number;
  private pageEnd?: number;
  public itemsPerPage: number = 10;

  public template: FormNode = {
    name: 'criteria',
    type: FormNodeTypes.GROUP,
    children: [
      {
        name: 'filter',
        label: 'Search filter',
        value: '',
        type: FormNodeTypes.CONTROL
      },
      {
        name: 'term',
        value: '',
        type: FormNodeTypes.CONTROL
      }
    ]
  };

  ngOnInit() {
    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
    this.globalErrorService.clearErrors();
    this.route.params.pipe(take(1)).subscribe(p => (this.params = p));
    this.technicalRecordService.editableTechRecord$.pipe(take(1)).subscribe(data => (this.viewableTechRecord = data));
    this.referenceDataService
      .getTyreSearchReturn$()
      .pipe(take(1))
      .subscribe(data => {
        this.searchResults = data;
      });
    this.referenceDataService
      .getTyreSearchCriteria$()
      .pipe(take(1))
      .subscribe(v => {
        this.form.controls['filter'].patchValue(v.filter);
        this.form.controls['term'].patchValue(v.term);
      });

    if (!this.viewableTechRecord) {
      this._ngZone.run(() => {
        this.router.navigate(['../..'], { relativeTo: this.route });
      });
    }
  }

  get roles() {
    return Roles;
  }
  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
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
        mergeMap(() => this.store.select(selectTyreSearchReturn)),
        take(1)
      )
      .subscribe(data => {
        this._ngZone.run(() => {
          this.router.navigate(['.'], { relativeTo: this.route, queryParams: { 'search-results-page': 1 } });
        });
        this.searchResults = data;
      });
  }

  handleAddTyreToRecord(tyre: ReferenceDataTyre): void {
    const axleIndex = Number(this.params.axleNumber!) - 1;

    if (this.viewableTechRecord?.axles![axleIndex].tyres) {
      this.viewableTechRecord = cloneDeep(this.viewableTechRecord);

      this.viewableTechRecord.axles![axleIndex].tyres!.tyreCode = Number(tyre.code);
      this.viewableTechRecord.axles![axleIndex].tyres!.tyreSize = tyre.tyreSize;
      this.viewableTechRecord.axles![axleIndex].tyres!.plyRating = tyre.plyRating;
      if (this.viewableTechRecord.axles![axleIndex].tyres!.fitmentCode) {
        this.viewableTechRecord.axles![axleIndex].tyres!.dataTrAxles =
          this.viewableTechRecord.axles![axleIndex].tyres!.fitmentCode === 'single'
            ? parseInt(tyre.loadIndexSingleLoad)
            : parseInt(tyre.loadIndexTwinLoad);
      }

      this.technicalRecordService.updateEditingTechRecord(this.viewableTechRecord);
      this.router.navigate(['../..'], { relativeTo: this.route });
    }
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }
  getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
    return errors.find(error => error.anchorLink === name);
  }
  trackByFn(i: number, r: ReferenceDataTyre) {
    return r.resourceKey;
  }
  cancel() {
    this.globalErrorService.clearErrors();
    this._ngZone.run(() => {
      this.router.navigate(['../..'], { relativeTo: this.route });
    });
  }
}
