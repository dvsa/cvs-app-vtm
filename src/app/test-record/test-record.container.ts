import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { selectTestTypeById } from '@app/store/selectors/VehicleTestResultModel.selectors';
import {ActivatedRoute} from '@angular/router';
import {TestResultModel} from '@app/models/test-result.model';
import {TestType} from '@app/models/test.type';
import {initAll} from 'govuk-frontend';
import {TestRecordMapper} from '@app/test-record/test-record.mapper';

@Component({
  selector: 'vtm-test-record-container',
  template: `
    <ng-container *ngIf="testRecordObservable$ | async">
      <ng-container *ngIf="(testRecordObservable$ | async)[1] as testRecord">
        <ng-container *ngIf="(testRecordObservable$ | async)[0] as testType">
          <vtm-test-record
          [testRecord] = testRecord
          [testType] = testType
          [testTypeNumber] = this.testTypeNumber
          [seatBeltApplicable] = this.seatBeltApplicable
          [emissionDetailsApplicable] = this.emissionDetailsApplicable
          [defectsApplicable] = this.defectsApplicable
          [testSectionApplicable1] = this.testSectionApplicable1
          [testSectionApplicable2] = this.testSectionApplicable2
          >
          </vtm-test-record>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRecordContainer implements OnInit {

  testRecordObservable$: Observable<(TestType|TestResultModel)[]>;
  testTypeNumber: string;
  seatBeltApplicable: {} = this.testRecordMapper.seatBeltApplicable;
  defectsApplicable: {}  = this.testRecordMapper.defectsApplicable;
  emissionDetailsApplicable: {} = this.testRecordMapper.emissionDetailsApplicable;
  testSectionApplicable1: {} = this.testRecordMapper.testSectionApplicable1;
  testSectionApplicable2: {} = this.testRecordMapper.testSectionApplicable2;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, private testRecordMapper: TestRecordMapper ) {}

  ngOnInit(): void {
    initAll();
    this.route.paramMap.subscribe(params => {
      this.testTypeNumber = params.get('id');
      this.testRecordObservable$ = this.store.select(selectTestTypeById(this.testTypeNumber));
    });
  }

}




