import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestType } from '@app/models/test.type';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import { SelectOption } from '@app/models/select-option';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';

@Component({
  selector: 'vtm-seatbelt-installation-check-edit',
  templateUrl: './seatbelt-installation-check-edit.component.html',
  styleUrls: ['./seatbelt-installation-check-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SeatbeltInstallationCheckEditComponent implements OnInit {
  @Input() testType: TestType;
  @Input() formErrors: string[];
  testResultChildForm: FormGroupDirective;
  testTypeGroup: FormGroup;
  seatbeltInstallationCheckDateOptions: SelectOption[];
  seatbeltOptionSelected: string;

  constructor(parentForm: FormGroupDirective) {
    this.testResultChildForm = parentForm;
  }

  ngOnInit() {
    this.testTypeGroup = this.testResultChildForm.form.get('testType') as FormGroup;
    if (!!this.testTypeGroup) {
      this.testTypeGroup.addControl(
        'seatbeltInstallationCheckDate',
        new FormControl(Validators.required)
      );
      this.testTypeGroup.addControl(
        'numberOfSeatbeltsFitted',
        new FormControl(this.testType.numberOfSeatbeltsFitted, Validators.required)
      );
      this.testTypeGroup.addControl(
        'lastSeatbeltInstallationCheckDate',
        new FormControl(this.testType.lastSeatbeltInstallationCheckDate, Validators.required)
      );
    }

    this.seatbeltOptionSelected = this.testType.seatbeltInstallationCheckDate ? 'Yes' : 'No';
    this.seatbeltInstallationCheckDateOptions = new DisplayOptionsPipe().transform(
      ['Yes', 'No'],
      [this.seatbeltOptionSelected]
    );
  }
}
