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
  @Input() defectData: Defect | undefined;

  defectTpl: FormNode;

  constructor() {
    this.defectTpl = DefectTpl;
  }

  mapLocationText(location: DefectAdditionalInformationLocation) {
    return Object.entries(location)
      .map((val) => `${val[0]}: ${val[1]}`)
      .join(` / `);
  }
}
