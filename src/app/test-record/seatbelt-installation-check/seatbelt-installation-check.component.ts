import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TestType} from '@app/models/test.type';

@Component({
  selector: 'vtm-seatbelt-installation-check',
  templateUrl: './seatbelt-installation-check.component.html',
  styleUrls: ['./seatbelt-installation-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatbeltInstallationCheckComponent implements OnInit {

  @Input() testType: TestType;

  constructor() { }

  ngOnInit() {
  }

}
