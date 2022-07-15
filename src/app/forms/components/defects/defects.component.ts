import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-defects[form]',
  templateUrl: './defects.component.html'
})
export class DefectsComponent {
  @Input() isEditing = false;
  @Input() form!: CustomFormGroup;

  @Output() formsChange = new EventEmitter<(CustomFormGroup | CustomFormArray)[]>();

  get defectsForm() {
    return this.form.get(['testTypes', '0', 'defects']) as CustomFormArray;
  }

  getDefectForm(i: number) {
    return this.defectsForm.controls[i] as CustomFormGroup;
  }

  trackByFn(index: number, defect: AbstractControl): number {
    return index;
  }

  get defectCount() {
    return this.defectsForm.controls.length;
  }
}
