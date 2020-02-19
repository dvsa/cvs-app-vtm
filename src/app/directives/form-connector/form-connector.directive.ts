import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

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

  constructor(private formGroupDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.formChange = this.formGroupDirective.form.valueChanges
      .pipe(
        debounceTime(this.debounce),
        tap((value) => {
          console.log('VALUE:', value, 'PATH:', this.path);
        })
      )
      .subscribe();

    console.log(this.formGroupDirective.form);
  }

  ngOnDestroy(): void {
    this.formChange.unsubscribe();
  }
}
