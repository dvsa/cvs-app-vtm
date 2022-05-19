import { Component, Input } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { Defect } from '@models/defect';
import { DefectAdditionalInformationLocation } from '@models/defectAdditionalInformationLocation';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.component.html',
  styleUrls: ['./defect.component.scss']
})
export class DefectComponent {
  @Input() edit = false;
  @Input() defectData!: Defect;

  defectTpl: FormNode;

  constructor() {
    this.defectTpl = DefectTpl;
  }

  mapLocationText(location: DefectAdditionalInformationLocation) {
    return Object.entries(location)
      .filter(([key, value]) => {
        return (typeof value === 'number' && isNaN(value) === false) || value;
      })
      .map(([key, value]) => `${key}: ${value}`)
      .join(` / `);
  }
}
