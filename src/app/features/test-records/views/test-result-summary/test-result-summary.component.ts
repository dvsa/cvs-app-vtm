import { Component, OnDestroy, OnInit } from '@angular/core';
import { Defect } from '@api/test-results';
import { Roles } from '@models/roles.enum';
import { TestResultDefects } from '@models/test-results/test-result-defects.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestType } from '@models/test-types/test-type.model';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { defects, DefectsState } from '@store/defects';
import { map, Observable, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-test-result-summary',
  templateUrl: './test-result-summary.component.html',
  styleUrls: ['./test-result-summary.component.scss']
})
export class TestResultSummaryComponent implements OnInit, OnDestroy {
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  techRecord$: Observable<TechRecordModel | undefined> = this.techRecordService.selectedVehicleTechRecord$.pipe(
    switchMap(techRecord => (techRecord ? this.techRecordService.viewableTechRecord$(techRecord, this.destroy$) : of(undefined)))
  );

  private destroy$ = new Subject<void>();

  constructor(
    private defectsStore: Store<DefectsState>,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService,
    private techRecordService: TechnicalRecordService
  ) {}

  ngOnInit(): void {
    this.testResult$ = this.testRecordsService.editingTestResult$.pipe(
      switchMap(editingTestResult => (editingTestResult ? of(editingTestResult) : this.testRecordsService.testResult$))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get Roles() {
    return Roles;
  }

  public get defects$(): Observable<Defect[]> {
    return this.defectsStore.select(defects);
  }

  get test$(): Observable<TestType | undefined> {
    return this.routerService.getRouteParam$('testNumber').pipe(
      switchMap(testNumber => {
        return this.testResult$.pipe(
          map(testResult => {
            return testResult?.testTypes.find(t => t.testNumber === testNumber);
          })
        );
      })
    );
  }

  get testDefects$(): Observable<TestResultDefects | undefined> {
    return this.test$.pipe(map(test => test?.defects));
  }

  public get isTestTypeGroupEditable$(): Observable<boolean> {
    return this.testRecordsService.isTestTypeGroupEditable$;
  }

  routerParam(param: string): Observable<string | undefined> {
    return this.routerService.getRouteParam$(param);
  }

  categoryColor(category: string): 'red' | 'yellow' | 'green' | 'blue' {
    return (<Record<string, 'red' | 'green' | 'yellow' | 'blue'>>{ major: 'red', minor: 'yellow', dangerous: 'red', advisory: 'blue' })[category];
  }
}
