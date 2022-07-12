import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { Defect } from '@models/defect';
import { DefectAdditionalInformationLocation } from '@models/defectAdditionalInformationLocation';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DynamicFormGroupComponent } from '../dynamic-form-group/dynamic-form-group.component';

@Component({
  selector: 'app-defect[defect]',
  templateUrl: './defect.component.html',
})
export class DefectComponent {
  @ViewChild(DynamicFormGroupComponent) private set dynamicFormGroupComponent(component: DynamicFormGroupComponent) {
    this.formChange.emit(component.form);
  }

  @Input() isEditing = false;
  @Input() defect!: Defect;

  @Output() formChange = new EventEmitter<CustomFormGroup | CustomFormArray>();

  template: FormNode;

  constructor(private pipe: DefaultNullOrEmpty) {
    this.template = DefectTpl;
  }

  combined(...params: string[]): string {
    return params.map(p => this.pipe.transform(p)).join(' / ');
  }

  /**
   * takes the location object where all properties are optional and returns a string with all the properties that have values separated with ` / `.
   * While we don't know how to format the string, we show the properties as `key: value`.
   * TODO: update string format once we have service design.
   * @param location - DefectAdditionalInformationLocation object
   * @returns string
   */
  mapLocationText(location: DefectAdditionalInformationLocation) {
    return Object.entries(location)
      .filter(([key, value]) => (typeof value === 'number' && isNaN(value) === false) || value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' / ');
  }
}
