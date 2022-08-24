import { AfterViewChecked, Component, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DefectsComponent } from '@forms/components/defects/defects.component';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { defects, DefectsState } from '@store/defects';
import merge from 'lodash.merge';
import { map, Observable, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-base-test-record[testResult]',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent implements AfterViewChecked, OnDestroy {
  @ViewChildren(DynamicFormGroupComponent) sections?: QueryList<DynamicFormGroupComponent>;
  @ViewChild(DefectsComponent) defects?: DefectsComponent;

  @Input() testResult!: TestResultModel;
  @Input() isEditing: boolean = false;
  @Input() sectionTemplates: FormNode[] = [];

  @Output() newTestResult = new EventEmitter<TestResultModel>();

  private destroy$ = new Subject<void>();

  techRecord$: Observable<TechRecordModel | undefined> = this.techRecordService.selectedVehicleTechRecord$.pipe(
    switchMap(techRecord => (techRecord ? this.techRecordService.viewableTechRecord$(techRecord, this.destroy$) : of(undefined)))
  );

  constructor(
    private defectsStore: Store<DefectsState>,
    private techRecordService: TechnicalRecordService,
    private testTypesService: TestTypesService,
    private routerService: RouterService
  ) {}

  ngAfterViewChecked(): void {
    this.handleFormChange({});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
        return this.testResult.testTypes?.find(t => testNumber && testNumber === t.testNumber);
      })
    );
  }

  get selectAllTestTypes$() {
    return this.testTypesService.selectAllTestTypes$;
  }

  get defects$(): Observable<Defect[]> {
    return this.defectsStore.select(defects);
  }

  get testNumber$(): Observable<string | undefined> {
    return this.routerService.routeNestedParams$.pipe(map(params => params['testNumber']));
  }
}
