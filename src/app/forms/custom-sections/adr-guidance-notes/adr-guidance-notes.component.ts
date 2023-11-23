import { KeyValue } from '@angular/common';
import {
  AfterContentInit,
  Component, OnDestroy, OnInit,
} from '@angular/core';
import {
  FormArray,
  FormGroup, NG_VALUE_ACCESSOR, NgControl,
} from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';
import { CustomControl, CustomFormControl } from '@forms/services/dynamic-form.types';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-adr-guidance-notes',
  templateUrl: './adr-guidance-notes.component.html',
  styleUrls: ['./adr-guidance-notes.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AdrGuidanceNotesComponent, multi: true }],
})
export class AdrGuidanceNotesComponent extends BaseControlComponent implements OnInit, AfterContentInit, OnDestroy {

  destroy$ = new ReplaySubject<boolean>(1);

  form?: FormGroup;
  ngControl?: KeyValue<string, CustomControl>;
  formArray = new FormArray<CustomFormControl>([]);

  ngOnInit() {
    this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
      this.control?.patchValue(changes, { emitModelToViewChange: true });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  override ngAfterContentInit() {
    const injectedControl = this.injector.get(NgControl, null);
    if (injectedControl) {
      const ngControl = injectedControl.control as unknown as KeyValue<string, CustomControl>;
      if (ngControl.value) {
        this.name = ngControl.key;
        this.control = ngControl.value;
        this.ngControl = ngControl;
        this.form = this.injector.get(FORM_INJECTION_TOKEN) as FormGroup;
        this.formArray.push(new CustomFormControl(ngControl.value.meta));
      }
    }
  }

  addGuidanceNote() {
    const first = this.formArray.at(0);
    this.formArray.push(new CustomFormControl(first.meta));
  }

  removeGuideNote(index: number) {
    if (this.formArray.length < 2) return;
    this.formArray.removeAt(index);
  }

}
