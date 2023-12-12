import {
  AfterContentInit,
  Component, OnDestroy, OnInit,
} from '@angular/core';
import {
  FormArray,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-adr-guidance-notes',
  templateUrl: './adr-guidance-notes.component.html',
  styleUrls: ['./adr-guidance-notes.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AdrGuidanceNotesComponent, multi: true }],
})
export class AdrGuidanceNotesComponent extends CustomFormControlComponent implements OnInit, AfterContentInit, OnDestroy {
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
    super.ngAfterContentInit();
    const { form, control } = this;

    if (!form) return;
    if (!control) return;

    const value = form.get(this.name)?.value;
    const values = Array.isArray(value) && value.length ? value : [null];
    values.forEach((guidanceNoteType: string) => {
      this.formArray.push(new CustomFormControl(control.meta, guidanceNoteType));
    });
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
