import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {IAppState} from '@app/technical-record/adr-details/adr-details-form/store/adrDetailsForm.state';
import {selectSelectedVehicleTestResultModel} from '@app/store/selectors/VehicleTestResultModel.selectors';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {initAll} from 'govuk-frontend';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {TestResultModel} from '@app/models/test-result.model';
import {TestType} from '@app/models/test.type';

@Component({
  selector: 'vtm-test-record',
  templateUrl: './test-record.component.html',
  styleUrls: ['./test-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit {

  testResultObservable$: Observable<any>;
  testRecord: TestResultModel;
  testType: TestType;
  testTypeNumber: string;
  seatBeltApplicable: string[] = ['1', '3', '4', '7', '8', '10', '14', '15', '16', '18', '19', '21', '22', '23', '27', '28', '93'];
  emissionDetailsApplicable: string[] = ['44', '39', '45'];
  defectsApplicable: string[] = ['30', '31', '32', '33', '34', '35', '36', '38', '39', '44', '45', '47', '48',
    '49', '50', '56', '57', '59', '60', '85', '86', '87', '88', '89', '90', '100', '121'];

  constructor(private _store: Store<IAppState>, private route: ActivatedRoute, public techRecHelpers: TechRecordHelpersService) {
  }

  ngOnInit() {
    initAll();
    this.route.paramMap.subscribe(params => {
      this.testTypeNumber = params.get('id');
    });
    this.testResultObservable$ = this._store.select(selectSelectedVehicleTestResultModel);
    if (this.testResultObservable$) {
      this.testResultObservable$.subscribe(testResults => {
        let tType;
        let testRecord;
        const tTypeNumber = this.testTypeNumber;
        if (testResults) {
          Object.keys(testResults).forEach(function (tRIndex) {
            testResults[tRIndex].testTypes.some(res => {
              if (res.testNumber === tTypeNumber) {
                tType = res;
                testRecord = testResults[tRIndex];
                return res;
              }
            });
          });
        }
        this.testType = tType;
        this.testRecord = testRecord;
      });
    }
  }

  goBack() {
    window.history.back();
  }

}
