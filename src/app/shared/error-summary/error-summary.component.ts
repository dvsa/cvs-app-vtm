import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'vtm-error-summary',
  templateUrl: './error-summary.component.html',
  styleUrls: ['./error-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorSummaryComponent {
  errorMessage$: Observable<string>;
  constructor(private _store: Store<IAppState>) {
    this.errorMessage$ = this._store.pipe(select('error'));
  }

}
