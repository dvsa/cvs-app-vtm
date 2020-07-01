import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'vtm-record-identification-edit',
  templateUrl: './record-identification-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class RecordIdentificationEditComponent implements OnInit {
  vehicleRecordFg: FormGroup;

  @Input() vin: string;
  @Input() primaryVrm: string;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.vehicleRecordFg = this.parent.form;

    this.vehicleRecordFg.addControl('vin', this.fb.control(decodeURIComponent(this.vin)));
    this.vehicleRecordFg.addControl(
      'primaryVrm',
      this.fb.control(decodeURIComponent(this.primaryVrm))
    );
  }
}
