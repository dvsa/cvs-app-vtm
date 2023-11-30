import { KeyValue } from '@angular/common';
import {
  AfterContentInit,
  Component, OnDestroy, OnInit,
} from '@angular/core';
import {
  FormArray,

  FormGroup,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';
import { CustomControl, CustomFormControl } from '@forms/services/dynamic-form.types';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CustomControlComponentComponent } from '../custom-control-component/custom-control-component.component';

@Component({
  selector: 'app-adr-guidance-notes',
  templateUrl: './adr-guidance-notes.component.html',
  styleUrls: ['./adr-guidance-notes.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AdrGuidanceNotesComponent, multi: true }],
})
export class AdrGuidanceNotesComponent extends CustomControlComponentComponent implements OnInit, AfterContentInit, OnDestroy {
  destroy$ = new ReplaySubject<boolean>(1);
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
        this.form = this.injector.get(FORM_INJECTION_TOKEN) as FormGroup;
        const value = this.form.get(this.name)?.value;
        const values = Array.isArray(value) && value.length ? value : [null];
        values.forEach((guidanceNoteType: string) => {
          this.formArray.push(new CustomFormControl({ ...ngControl.value.meta }, guidanceNoteType));
        });
      }
    }
  }

  addGuidanceNote() {
    const first = this.formArray.at(0);
    this.formArray.push(new CustomFormControl(first.meta));
  }

  removeGuidanceNote(index: number) {
    if (this.formArray.length < 2) return;
    this.formArray.removeAt(index);
  }

}
