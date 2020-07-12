import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';

@Directive({
  selector: '[vtmFormConnector]'
})
export class FormConnectorDirective implements OnInit, OnDestroy {
  @Input('vtmFormConnector') path: string;
  @Input() debounce = 400;

  formChange: Subscription;
  formSuccess: Subscription;
  formError: Subscription;

  constructor(private formGroupDirective: FormGroupDirective, private store: Store<IAppState>) {}

  ngOnInit(): void {
    this.formChange = this.formGroupDirective.form.valueChanges
      .pipe(
        debounceTime(this.debounce),
        tap(([formValue]: [FormGroup]) => {
          // TODO: to be removed
          console.log('VALUE: ', formValue, 'PATH: ', this.path);
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
