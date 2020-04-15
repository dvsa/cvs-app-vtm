import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, withLatestFrom, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { SetAppFormDirty } from '@app/store/actions/app-form-state.actions';
import { getAppFormState } from '../../store/selectors/app-form-state.selectors';
import { getTechViewState } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { VIEW_STATE } from '@app/app.enums';

@Directive({
  selector: '[vtmFormConnector]'
})
export class FormConnectorDirective implements OnInit, OnDestroy {
  @Input('vtmFormConnector') path: string;
  @Input() debounce = 400;
  // @Output() error = new EventEmitter();
  // @Output() success = new EventEmitter();

  formChange: Subscription;
  formSuccess: Subscription;
  formError: Subscription;

  constructor(private formGroupDirective: FormGroupDirective, private store: Store<IAppState>) {}

  ngOnInit(): void {
    this.formChange = this.formGroupDirective.form.valueChanges
      .pipe(
        debounceTime(this.debounce),
        withLatestFrom(this.store.select(getTechViewState), this.store.select(getAppFormState)),
        map(([forValue, viewState, appForm]: [FormGroup, VIEW_STATE, boolean]) => {
          // tap((value) => {
          console.log('VALUE: ', forValue, 'PATH: ', this.path);
          if (!this.formGroupDirective.form.pristine && viewState !== VIEW_STATE.VIEW_ONLY && appForm) {
            //     console.log('firing app form dirty');
            this.store.dispatch(new SetAppFormDirty());
          }
          // })
        })
      )
      .subscribe();
    console.log(this.formGroupDirective.form);
  }

  ngOnDestroy(): void {
    this.formChange.unsubscribe();
  }
}
