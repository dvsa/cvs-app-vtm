import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth, Params } from '@forms/services/dynamic-form.types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { Observable, Subscription, debounceTime } from 'rxjs';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { fetchReferenceDataByKey, ReferenceDataState } from '@store/reference-data';
import { Store } from '@ngrx/store';
import { selectAllReferenceDataByResourceType } from '@store/reference-data/selectors/reference-data.selectors';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { VehicleTechRecordModel, TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-tyres-search',
  templateUrl: './tyres-search.component.html',
  styleUrls: ['./tyres-search.component.scss']
})
export class TyresSearchComponent implements OnInit {
  @Input() viewableTechRecord?: TechRecordModel;
  @Input() isEditing = true;
  @Input() isDirty = false;
  @Input() type: FormNodeEditTypes = FormNodeEditTypes.SELECT;
  @Input() width?: FormNodeWidth;
  @Input() options?: MultiOptions = [
    { label: 'Tyre code', value: 'code' }
    // { label: 'Ply rating', value: 'plyRating' },
    // { label: 'Single load index', value: 'loadIndexSingleLoad' },
    // { label: 'Double load index', value: 'loadIndexTwinLoad' }
  ];
  @Output() formChange = new EventEmitter();

  constructor(
    public dfs: DynamicFormService,
    public globalErrorService: GlobalErrorService,
    private referenceDataService: ReferenceDataService,
    private referenceDataStore: Store<ReferenceDataState>,
    private route: ActivatedRoute,
    private router: Router,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.subscribe(data => (this.vehicleTechRecord = data));
  }

  public searchResults: Array<ReferenceDataTyre> | null = null;
  public missingTermErrorMessage = 'You must provide search criteria';
  public missingTypeErrorMessage = 'You must select a valid search filter';
  public vehicleTechRecord?: VehicleTechRecordModel;
  public editingTechRecord: TechRecordModel | undefined = undefined;
  public form!: CustomFormGroup;
  private formSubscription = new Subscription();
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
    // when done: make sure no tyre reference data is populated before here
    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
    this.formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => this.formChange.emit(event));
    this.globalErrorService.clearErrors();
    this.referenceDataService.loadReferenceData(ReferenceDataResourceType.Tyres);
    this.route.params.subscribe(p => (this.params = p));
    this.technicalRecordService.editableTechRecord$.pipe().subscribe(data => (this.editingTechRecord = data));
  }
  onChange = (event: any) => {
    this.isDirty = true;
    console.log(event);
  };
  ngOnDestroy(): void {
    /// how to test/make work??
    this.formSubscription.unsubscribe();
  }

  handleSearch(term: string, filter: string): void {
    console.log('find: {', filter, '} with value: {', term, '}');

    this.globalErrorService.clearErrors();
    this.searchResults = [];
    term = term.trim();
    // display loading
    // api call/reducer
    // switch case once the api changes are in?

    this.referenceDataStore.dispatch(fetchReferenceDataByKey({ resourceType: ReferenceDataResourceType.Tyres, resourceKey: term }));

    // if api fail display 0 found
    // if api success set state

    this.displaySearchResults(term, filter);
  }

  displaySearchResults(term: string, filter: string) {
    if (!term) {
      this.globalErrorService.addError({ error: this.missingTermErrorMessage, anchorLink: 'term' });
    } else if (!filter) {
      this.globalErrorService.addError({ error: this.missingTypeErrorMessage, anchorLink: 'term' });
    } else if (term && filter) {
      this.tyres$.subscribe(data =>
        data.map(each => {
          if (each.code === term) {
            this.searchResults?.push(each);
          } else {
            this.searchResults = [];
          }
        })
      );
    }
  }

  handleSubmit(tyre: ReferenceDataTyre): void {
    const axleIndex = Number(this.params.axleNumber!) - 1;
    console.log('adding: ', tyre, 'to axle index: ', axleIndex);

    // addTyreToTechRecord()

    this.router.navigate(['../..'], { relativeTo: this.route });
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
}
