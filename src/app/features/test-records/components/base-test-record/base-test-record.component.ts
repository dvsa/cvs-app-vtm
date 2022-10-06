import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DefectsComponent } from '@forms/components/defects/defects.component';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { Roles } from '@models/roles.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { DefectsState, filteredDefects } from '@store/defects';
import merge from 'lodash.merge';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-base-test-record[testResult]',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent implements AfterViewInit {
  @ViewChildren(DynamicFormGroupComponent) sections?: QueryList<DynamicFormGroupComponent>;
  @ViewChild(DefectsComponent) defects?: DefectsComponent;

  @Input() testResult!: TestResultModel;
  @Input() isEditing: boolean = false;
  @Input() expandSections = false;

  @Output() newTestResult = new EventEmitter<TestResultModel>();

  techRecord$: Observable<TechRecordModel | undefined>;
  constructor(
    private defectsStore: Store<DefectsState>,
    private techRecordService: TechnicalRecordService,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService
  ) {
    this.techRecord$ = this.techRecordService.techRecord$;
  }

  ngAfterViewInit(): void {
    this.handleFormChange({});
  }

  handleFormChange(event: any) {
    let latestTest: any;
    this.sections?.forEach(section => {
      const { form } = section;
      latestTest = merge(latestTest, form.getCleanValue(form));
    });
    const defectsValue = this.defects?.form.getCleanValue(this.defects?.form);
    latestTest = merge(latestTest, defectsValue, event);
    latestTest && Object.keys(latestTest).length > 0 && this.newTestResult.emit(latestTest as TestResultModel);
  }

  getDefects$(type: VehicleTypes): Observable<Defect[]> {
    return this.defectsStore.select(filteredDefects(type));
  }

  public get isTestTypeGroupEditable$(): Observable<boolean> {
    return this.testRecordsService.isTestTypeGroupEditable$;
  }
  public get roles() {
    return Roles;
  }

  get sectionTemplates$(): Observable<FormNode[] | undefined> {
    return this.testRecordsService.sectionTemplates$;
  }

  get testNumber$(): Observable<string | undefined> {
    return this.routerService.routeNestedParams$.pipe(map(params => params['testNumber']));
  }
}
