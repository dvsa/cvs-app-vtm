import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DefectsComponent } from '@forms/components/defects/defects.component';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { DefectsState, filteredDefects } from '@store/defects';
import merge from 'lodash.merge';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-base-test-record[testResult]',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent implements AfterViewInit {
  @ViewChildren(DynamicFormGroupComponent) sections?: QueryList<DynamicFormGroupComponent>;
  @ViewChild(DefectsComponent) defects?: DefectsComponent;

  @Input() testResult!: TestResultModel;
  @Input() isEditing: boolean = false;
  @Input() sectionTemplates: FormNode[] = [];

  @Output() newTestResult = new EventEmitter<TestResultModel>();

  techRecord$: Observable<TechRecordModel | undefined>;

  constructor(
    private defectsStore: Store<DefectsState>,
    private techRecordService: TechnicalRecordService,
    private testTypesService: TestTypesService,
    private routerService: RouterService
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

  get test$() {
    return this.testNumber$.pipe(
      map(testNumber => {
        return this.testResult.testTypes?.find(t => testNumber === t.testNumber);
      })
    );
  }

  get selectAllTestTypes$() {
    return this.testTypesService.selectAllTestTypes$;
  }

  getDefects$(type: VehicleTypes): Observable<Defect[]> {
    return this.defectsStore.select(filteredDefects(type));
  }

  get testNumber$(): Observable<string | undefined> {
    return this.routerService.routeNestedParams$.pipe(map(params => params['testNumber']));
  }
}
