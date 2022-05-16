import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defect';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.component.html',
  styleUrls: ['./defect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefectComponent {
  @Input() edit = false;
  @Input() defect?: Defect;
  @Input() formGroup?: CustomFormGroup;

  constructor() {}
}
