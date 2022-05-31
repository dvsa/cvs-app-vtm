import { Component, Input } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { Defect } from '@models/defect';
import { DefectAdditionalInformationLocation } from '@models/defectAdditionalInformationLocation';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.component.html',
})
export class DefectComponent {
  @Input() edit = false;
  @Input() defectData!: Defect;

  defectTpl: FormNode;

  constructor() {
    this.defectTpl = DefectTpl;
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
      .filter(([key, value]) => {
        return (typeof value === 'number' && isNaN(value) === false) || value;
      })
      .map(([key, value]) => `${key}: ${value}`)
      .join(` / `);
  }
}
