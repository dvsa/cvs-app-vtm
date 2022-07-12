import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';
import { Defects } from '@models/defects';

@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
})
export class DefectsComponent {
  @Input() isEditing = false;
  @Input() defects?: Defects;

  @Output() formsChange = new EventEmitter<(CustomFormGroup | CustomFormArray)[]>();

  forms: Array<CustomFormGroup | CustomFormArray>;

  constructor() {
    this.forms = new Array(this.defects?.length).fill(null);
  }

  emitFormChange(index: number, form: CustomFormGroup | CustomFormArray) {
    this.forms[index] = form;
    this.formsChange.emit(this.forms);
  }
}
