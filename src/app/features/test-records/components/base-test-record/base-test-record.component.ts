import {
  AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren,
} from '@angular/core';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { CustomDefectsComponent } from '@forms/custom-sections/custom-defects/custom-defects.component';
import { DefectsComponent } from '@forms/custom-sections/defects/defects.component';
import { RequiredStandardsComponent } from '@forms/custom-sections/required-standards/required-standards.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { Roles } from '@models/roles.enum';
import { TestResultStatus } from '@models/test-results/test-result-status.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { DefectsState, filteredDefects } from '@store/defects';
import { selectTechRecord } from '@store/technical-records';
import merge from 'lodash.merge';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-base-test-record[testResult]',
  templateUrl: './base-test-record.component.html',
  styleUrls: ['./base-test-record.component.scss'],
})
export class BaseTestRecordComponent implements AfterViewInit {
  @ViewChildren(DynamicFormGroupComponent) sections?: QueryList<DynamicFormGroupComponent>;
  @ViewChild(DefectsComponent) defects?: DefectsComponent;
  @ViewChild(CustomDefectsComponent) customDefects?: CustomDefectsComponent;
  @ViewChild(RequiredStandardsComponent) requiredStandards?: RequiredStandardsComponent;

  @Input() testResult!: TestResultModel;
  @Input() isEditing = false;
  @Input() expandSections = false;
  @Input() isReview = false;

  @Output() newTestResult = new EventEmitter<TestResultModel>();

  techRecord$: Observable<V3TechRecordModel | undefined>;
  constructor(
    private defectsStore: Store<DefectsState>,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService,
    private store: Store,
    private globalErrorService: GlobalErrorService,
  ) {
    this.techRecord$ = this.store.select(selectTechRecord);
  }

  ngAfterViewInit(): void {
    this.handleFormChange({});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFormChange(event: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let latestTest: any;
    this.sections?.forEach((section) => {
      const { form } = section;
      latestTest = merge(latestTest, form.getCleanValue(form));
    });
    const defectsValue = this.defects?.form.getCleanValue(this.defects?.form);
    const customDefectsValue = this.customDefects?.form.getCleanValue(this.customDefects?.form);
    const requiredStandardsValue = this.requiredStandards?.form.getCleanValue(this.requiredStandards?.form);

    latestTest = merge(latestTest, defectsValue, customDefectsValue, requiredStandardsValue, event);

    if (latestTest && Object.keys(latestTest).length > 0) {
      this.newTestResult.emit(latestTest as TestResultModel);
    }
  }

  validateEuVehicleCategory(_event: unknown) {
    this.sections?.forEach((section) => {
      const { form } = section;
      if (form.meta.name === 'vehicleSection') {
        const errors: GlobalError[] = [];
        DynamicFormService.validateControl(form.get('euVehicleCategory') as CustomFormControl, errors);
        this.globalErrorService.setErrors(errors);
      }
    });
  }

  getDefects$(type: VehicleTypes): Observable<Defect[]> {
    return this.defectsStore.select(filteredDefects(type));
  }

  get isTestTypeGroupEditable$(): Observable<boolean> {
    return this.testRecordsService.isTestTypeGroupEditable$;
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get statuses(): typeof TestResultStatus {
    return TestResultStatus;
  }

  get sectionTemplates$(): Observable<FormNode[] | undefined> {
    return this.testRecordsService.sectionTemplates$;
  }

  get resultOfTest(): resultOfTestEnum {
    return this.testResult?.testTypes[0].testResult;
  }

  get testNumber$(): Observable<string | undefined> {
    return this.routerService.routeNestedParams$.pipe(map((params) => params['testNumber']));
  }
}
