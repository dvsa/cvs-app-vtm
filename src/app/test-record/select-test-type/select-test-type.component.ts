import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { selectTestTypeById } from '@app/store/selectors/VehicleTestResultModel.selectors';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { ActivatedRoute } from '@angular/router';
import { TestRecordTestType } from '@app/models/test-record-test-type';

@Component({
  selector: 'vtm-select-test-type',
  templateUrl: './select-test-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTestTypeComponent implements OnInit {
  testRecordObservable$: Observable<TestRecordTestType>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.testRecordObservable$ = this.store.select(selectTestTypeById(params.get('id')));
    });
  }
}
