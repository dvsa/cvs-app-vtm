import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { SetAppFormDirty } from '@app/store/actions/app-form-state.actions';
import { ViewState } from '@angular/core/src/view';

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
        tap((value) => {
          console.log('VALUE: ', value, 'PATH: ', this.path);
          if (!this.formGroupDirective.form.pristine) {
            this.store.dispatch(new SetAppFormDirty());
          }
        })
      )
      .subscribe();
    console.log(this.formGroupDirective.form);
  }

  ngOnDestroy(): void {
    this.formChange.unsubscribe();
  }
}
