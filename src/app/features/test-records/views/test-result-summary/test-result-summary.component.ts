import { Component, OnInit } from '@angular/core';
import { Defect } from '@api/test-results';
import { FormNode } from '@forms/services/dynamic-form.types';
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
import { map, Observable, of, skipWhile, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-test-result-summary',
  templateUrl: './test-result-summary.component.html',
  styleUrls: ['./test-result-summary.component.scss']
})
export class TestResultSummaryComponent implements OnInit {
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  techRecord$: Observable<TechRecordModel | undefined>;
  sectionTemplates$: Observable<FormNode[] | undefined> = of(undefined);

  constructor(
    private defectsStore: Store<DefectsState>,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService,
    private techRecordService: TechnicalRecordService
  ) {
    this.techRecord$ = this.techRecordService.techRecord$;
  }

  ngOnInit(): void {
    this.testResult$ = this.testRecordsService.editingTestResult$.pipe(
      switchMap(editingTestResult => (editingTestResult ? of(editingTestResult) : this.testRecordsService.testResult$))
    );
    this.testResult$
      .pipe(
        skipWhile(testResult => !testResult),
        take(1)
      )
      .subscribe(testResult => {
        this.testRecordsService.editingTestResult(testResult!);
      });
    this.sectionTemplates$ = this.testRecordsService.sectionTemplates$;
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



  routerParam(param: string): Observable<string | undefined> {
    return this.routerService.getRouteParam$(param);
  }

  categoryColor(category: string): 'red' | 'yellow' | 'green' | 'blue' {
    return (<Record<string, 'red' | 'green' | 'yellow' | 'blue'>>{ major: 'red', minor: 'yellow', dangerous: 'red', advisory: 'blue' })[category];
  }

  
}
