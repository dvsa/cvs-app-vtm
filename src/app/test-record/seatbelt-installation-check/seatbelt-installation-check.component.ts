import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { VIEW_STATE } from '@app/app.enums';
import {ControlContainer, FormGroupDirective} from '@angular/forms';

@Component({
  selector: 'vtm-seatbelt-installation-check',
  templateUrl: './seatbelt-installation-check.component.html',
  styleUrls: ['./seatbelt-installation-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [ { provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SeatbeltInstallationCheckComponent implements OnInit {
  @Input() testType: TestType;
  @Input() editState: VIEW_STATE;

  constructor() {}

  ngOnInit() {}
}
