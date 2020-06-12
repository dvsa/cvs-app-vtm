import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { VIEW_STATE } from '@app/app.enums';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'vtm-seatbelt-installation-check',
  templateUrl: './seatbelt-installation-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SeatbeltInstallationCheckComponent implements OnChanges {
  @Input() testType: TestType;
  @Input() editState: VIEW_STATE;
  @Input() hasSeatBeltApplicable: boolean;
  seatbeltOptionSelected: string;

  constructor() {}

  ngOnChanges() {
    this.seatbeltOptionSelected = this.testType.seatbeltInstallationCheckDate ? 'Yes' : 'No';
  }
}
