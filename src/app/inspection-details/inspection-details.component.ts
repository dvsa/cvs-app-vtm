import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {Observable} from 'rxjs';
import {FormGroupState} from 'ngrx-forms';
import {adrDetailsFormModel} from '@app/models/adrDetailsForm.model';
import {select, Store} from '@ngrx/store';
import {IAppState} from '@app/store/state/adrDetailsForm.state';

@Component({
  selector: 'vtm-inspection-details',
  templateUrl: './inspection-details.component.html',
  styleUrls: ['./inspection-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionDetailsComponent implements OnInit {
  formState$: Observable<FormGroupState<adrDetailsFormModel>>;

  constructor(private _store: Store<IAppState>) {
    this.formState$ = this._store.pipe(select(s => s.adrDetails.formState));
  }

  ngOnInit(): void {
  }

}
