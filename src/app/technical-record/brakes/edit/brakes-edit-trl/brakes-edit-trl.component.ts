import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input
} from '@angular/core';
import { ControlContainer, FormGroupDirective, FormBuilder, FormGroup } from '@angular/forms';

import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-brakes-edit-trl',
  templateUrl: './brakes-edit-trl.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class BrakesEditTrlComponent implements OnInit {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;

  constructor(
    private parent: FormGroupDirective,
    private fb: FormBuilder,
    private techRecHelper: TechRecordHelperService,
    private detectChange: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.techRecordFg = this.parent.form as FormGroup;
  }
}
