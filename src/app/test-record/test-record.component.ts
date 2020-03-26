import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {selectSelectedVehicleTestResultModel} from '@app/store/selectors/VehicleTestResultModel.selectors';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {TestResultModel} from '@app/models/test-result.model';
import {TestType} from '@app/models/test.type';
import {IAppState} from '@app/store/state/app.state';

@Component({
  selector: 'vtm-test-record',
  templateUrl: './test-record.component.html',
  styleUrls: ['./test-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit {

  testResultObservable$: Observable<TestResultModel>;
  testType: TestType;
  testTypeNumber: string;

  constructor(private _store: Store<IAppState>, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.testTypeNumber = params.get('id');
    });
    this.testResultObservable$ = this._store.pipe(select(selectSelectedVehicleTestResultModel));
    this.testResultObservable$.subscribe(testResults => {
      let tType;
      const tTypeNumber = this.testTypeNumber;
      Object.keys(testResults).forEach(function (tRIndex) {
        testResults[tRIndex].testTypes.some(res => {
          if (res.testNumber === tTypeNumber) {
            tType = res;
            return res;
          }
        });
      });
      this.testType = tType;
    });
  }

}
