import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { VehicleTechRecordModel, TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';

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
    { label: 'Tyre code', value: 'code' },
    { label: 'Ply rating', value: 'plyRating' },
    { label: 'Single load index', value: 'loadIndexSingleLoad' },
    { label: 'Double load index', value: 'loadIndexTwinLoad' }
  ];
  @Output() formChange = new EventEmitter();

  constructor(
    public dfs: DynamicFormService,
    public globalErrorService: GlobalErrorService,
    private store: Store<TechnicalRecordServiceState>,
    private route: ActivatedRoute,
    private router: Router,
    private technicalRecordService: TechnicalRecordService,
    private referenceDataService: ReferenceDataService
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.subscribe(data => (this.vehicleTechRecord = data));
  }
  public searchResults: Array<{}> | null = [];
  public missingTermErrorMessage = 'You must provide search criteria';
  public missingTypeErrorMessage = 'You must select a valid search criteria';
  public vehicleTechRecord?: VehicleTechRecordModel;
  public editingTechRecord: TechRecordModel | undefined = undefined;
  public searchFilterLabel: string = 'Search Filter'; ///// temporary
  public testSearchFilterTerm: string = 'code'; ////temporary

  get roles() {
    return Roles;
  }
  get form(): Array<FormNode> {
    // need help to create and bind new form template
    return [
      {
        name: 'tyreSearchFilter',
        label: 'Search filter',
        type: FormNodeTypes.TITLE
      }
    ];
  }
  get currentVrm(): string | undefined {
    // works, no touching
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  // set up validators for each search term

  ngOnInit() {
    this.globalErrorService.clearErrors();
    this.referenceDataService.loadReferenceData(ReferenceDataResourceType.Tyres);
    this.technicalRecordService.editableTechRecord$.pipe().subscribe(data => (this.editingTechRecord = data));
    // make sure no tyre reference data is populated before here, excess api calls
    console.log('editing tech record:', this.editingTechRecord);
    console.log('vehicle tech record:', this.vehicleTechRecord);
    console.log('vrm:', this.currentVrm);
  }

  private response = true; ///// temporary

  navigateSearch(term: string): void {
    this.globalErrorService.clearErrors();

    // collect type, key from select, search term
    term = term.trim();
    // api call
    // if api fail set response to false and display 0 found
    // if api success set state
    // subscribe to state, collect data
    // paginate data
    if (this.response === true) {
      this.searchResults!.push({
        description: 'Tyre 101',
        code: '101',
        loadIndexSingleLoad: '128',
        tyreSize: '235/75-17.5',
        dateTimeStamp: '03-APR-14',
        userId: '1234',
        loadIndexTwinLoad: '124',
        plyRating: '12'
      });
      console.log(this.searchResults);
    } else if (this.response === false) {
      this.searchResults = null;
    }

    if (!term) {
      this.globalErrorService.addError({ error: this.missingTermErrorMessage, anchorLink: 'search-term' });
    }
  }

  add(axleindex: number, tyreIndex: number): void {
    console.log('adding');
    // set editing tech record state
    // navigate back to tech record with tech record changes and tyre changes intact
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
    return errors.find(error => error.anchorLink === name);
  }

  cancel() {
    /// Has the same issue as navigating back through breadcrumbs, editing = false, tech record form changes = wiped
    if (!this.isDirty || confirm('Your changes will not be saved. Are you sure?')) {
      this.globalErrorService.clearErrors();
      this.router.navigate(['../..'], { relativeTo: this.route });
    }
  }
}
