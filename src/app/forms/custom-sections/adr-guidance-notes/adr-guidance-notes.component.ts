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
    super.ngAfterContentInit();
    if (this.control) this.formArray.push(new CustomFormControl(this.control.meta));
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
