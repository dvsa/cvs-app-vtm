import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, withLatestFrom, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { SetAppFormDirty } from '@app/store/actions/app-form-state.actions';
import { getAppFormState } from '../../store/selectors/app-form-state.selectors';

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
        withLatestFrom(this.store.select(getAppFormState)),
        tap(([formValue, appForm]: [FormGroup, boolean]) => {
          // TODO: to be removed
          console.log('VALUE: ', formValue, 'PATH: ', this.path);
          if (!this.formGroupDirective.form.pristine && appForm) {
            this.store.dispatch(new SetAppFormDirty());
          }
        })
      )
      .subscribe();
    // TODO: to be removed
    console.log(this.formGroupDirective.form);
  }

  ngOnDestroy(): void {
    this.formChange.unsubscribe();
  }
}
