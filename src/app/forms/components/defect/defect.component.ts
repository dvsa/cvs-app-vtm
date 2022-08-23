import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { DefectAdditionalInformationLocation } from '@models/test-results/defectAdditionalInformationLocation';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
  selector: 'app-defect[form][index]',
  templateUrl: './defect.component.html',
  providers: [DefaultNullOrEmpty]
})
export class DefectComponent {
  @Input() form!: CustomFormGroup;
  @Input() isEditing = false;
  @Input() index!: number;
  @Output() removeDefect = new EventEmitter<number>();

  constructor(private pipe: DefaultNullOrEmpty) {}

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
  mapLocationText(location: DefectAdditionalInformationLocation): string {
    return !location
      ? '-'
      : Object.entries(location)
          .filter(([, value]) => (typeof value === 'number' && isNaN(value) === false) || value)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' / ');
  }
}
