import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormBuilder, FormGroup } from '@angular/forms';
import { VIEW_STATE } from '@app/app.enums';

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
  @Input() vin: string;
  @Input() primaryVrm: string;
  @Input() viewState: VIEW_STATE;

  vehicleRecordFg: FormGroup;
  disableVinEditing: boolean;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.disableVinEditing = this.viewState === VIEW_STATE.EDIT;

    this.vehicleRecordFg = this.parent.form;
    this.vehicleRecordFg.removeControl('vin');
    this.vehicleRecordFg.removeControl('primaryVrm');

    this.vehicleRecordFg.addControl('vin', this.fb.control(decodeURIComponent(this.vin)));
    this.vehicleRecordFg.addControl(
      'primaryVrm',
      this.fb.control(decodeURIComponent(this.primaryVrm))
    );
  }
}
