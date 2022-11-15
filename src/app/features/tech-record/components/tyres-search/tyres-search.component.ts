import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeTypes, Params } from '@forms/services/dynamic-form.types';
import { cloneDeep } from 'lodash';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { Observable } from 'rxjs';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReferenceDataState } from '@store/reference-data';
import { Store } from '@ngrx/store';
import { selectAllReferenceDataByResourceType } from '@store/reference-data/selectors/reference-data.selectors';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { updateEditingTechRecord } from '@store/technical-records/actions/technical-record-service.actions';
import { VehicleTechRecordModel, TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-tyres-search',
  templateUrl: './tyres-search.component.html',
  styleUrls: ['./tyres-search.component.scss']
})
export class TyresSearchComponent implements OnInit {
  options?: MultiOptions = [
    { label: 'Tyre code', value: 'code' },
    { label: 'Ply rating', value: 'plyrating' },
    { label: 'Single load index', value: 'singleload' },
    { label: 'Double load index', value: 'doubleload' }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    public dfs: DynamicFormService,
    public globalErrorService: GlobalErrorService,
    private referenceDataService: ReferenceDataService,
    private referenceDataStore: Store<ReferenceDataState>,
    private route: ActivatedRoute,
    private router: Router,
    private technicalRecordService: TechnicalRecordService,
    private store: Store<TechnicalRecordServiceState>
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.subscribe(data => (this.vehicleTechRecord = data));
  }

  public form!: CustomFormGroup;
  public isDirty = false;
  public isEditing = true;
  public missingTermErrorMessage = 'You must provide search criteria';
  public missingFilterErrorMessage = 'You must select a valid search filter';
  public searchResults: Array<ReferenceDataTyre> | null = null;
  public type: FormNodeEditTypes = FormNodeEditTypes.SELECT;
  public vehicleTechRecord?: VehicleTechRecordModel;
  public viewableTechRecord: TechRecordModel | undefined = undefined;
  private params: Params = {};

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

  get roles() {
    return Roles;
  }
  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }
  get tyres$(): Observable<ReferenceDataTyre[]> {
    return this.referenceDataStore.select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.Tyres)) as Observable<ReferenceDataTyre[]>;
  }

  ngOnInit() {
    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
    this.globalErrorService.clearErrors();
    this.route.params.subscribe(p => (this.params = p));
    this.technicalRecordService.editableTechRecord$.pipe().subscribe(data => (this.viewableTechRecord = data));
    if (!this.viewableTechRecord) {
      this.router.navigate(['../..'], { relativeTo: this.route });
    }
  }

  onChange = (event: any) => {
    this.isDirty = true;
  };

  handleSearch(term: string, filter: string): void {
    console.log('find: {', filter, '} with value: {', term, '}');

    this.globalErrorService.clearErrors();
    this.searchResults = [];
    term = term.trim();

    if (filter === 'code') {
      this.referenceDataService
        .fetchReferenceDataByKeySearch(ReferenceDataResourceType.Tyres, term)
        .subscribe(res => res.data.map(each => this.searchResults?.push(each as ReferenceDataTyre)));
    } else {
      this.referenceDataService.fetchTyreReferenceDataByKeySearch(filter, term).subscribe(res => {
        console.log(res);
      });
    }
  }

  displaySearchResults(term: string, filter: string) {
    this.searchResults = [];
    if (!term) {
      this.globalErrorService.addError({ error: this.missingTermErrorMessage, anchorLink: 'term' });
    } else if (!filter) {
      this.globalErrorService.addError({ error: this.missingFilterErrorMessage, anchorLink: 'term' });
    } else if (term && filter) {
      this.tyres$.subscribe(data =>
        data.map(each => {
          switch (filter) {
            case 'code':
              if (each.code.includes(term)) {
                this.searchResults?.push(each);
              }
              break;
            case 'plyRating':
              if (each.plyRating.includes(term)) {
                this.searchResults?.push(each);
              }
              break;
            case 'loadIndexSingleLoad':
              if (each.loadIndexSingleLoad.includes(term)) {
                this.searchResults?.push(each);
              }
              break;
            case 'loadIndexTwinLoad':
              if (each.loadIndexTwinLoad.includes(term)) {
                this.searchResults?.push(each);
              }
              break;
          }
        })
      );
    }
  }

  handleSubmit(tyre: ReferenceDataTyre): void {
    if (this.viewableTechRecord) {
      const axleIndex = Number(this.params.axleNumber!) - 1;
      this.viewableTechRecord = cloneDeep(this.viewableTechRecord);

      this.viewableTechRecord!.axles[axleIndex].tyres!.tyreCode = Number(tyre.code);
      this.viewableTechRecord!.axles[axleIndex].tyres!.tyreSize = tyre.tyreSize;
      this.viewableTechRecord!.axles[axleIndex].tyres!.plyRating = tyre.plyRating;

      this.store.dispatch(updateEditingTechRecord({ techRecord: this.viewableTechRecord! }));
      this.router.navigate(['../..'], { relativeTo: this.route });
    } else {
      console.error('Unable to update state, changes not saved');
      /// record relative to previous page lost on refresh - on refresh nav back a page
    }
  }

  getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
    return errors.find(error => error.anchorLink === name);
  }

  cancel() {
    if (!this.isDirty || confirm('Your changes will not be saved. Are you sure?')) {
      this.globalErrorService.clearErrors();
      this.router.navigate(['../..'], { relativeTo: this.route });
    }
  }

  private pageStart?: number;
  private pageEnd?: number;
  public itemsPerPage: number = 10;

  get paginatedFields() {
    return this.searchResults!.slice(this.pageStart, this.pageEnd);
  }
  get numberOfResults(): number {
    return this.searchResults?.length!;
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }
  trackByFn(i: number, r: ReferenceDataTyre) {
    return r.resourceKey!;
  }
}
