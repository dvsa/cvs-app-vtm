import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IAppState } from '@app/store/state/app.state';
import { getErrors } from '@app/store/selectors/error.selectors';

@Component({
  selector: 'vtm-error-summary',
  templateUrl: './error-summary.component.html',
  styleUrls: ['./error-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorSummaryComponent {
  errorList$: Observable<string[]>;
  constructor(private store: Store<IAppState>) {
    this.errorList$ = this.store.select(getErrors);
  }
}
