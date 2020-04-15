import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IAppState } from '@app/store/state/app.state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'vtm-loader',
  templateUrl: './spinner-loader.component.html',
  styleUrls: ['./spinner-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerLoaderComponent {
  loader$: Observable<boolean>;
  constructor(private _store: Store<IAppState>) {
    this.loader$ = this._store.pipe(select(state => state.loader.loading));
  }
}
