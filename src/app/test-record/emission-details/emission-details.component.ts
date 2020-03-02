import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TestType} from '@app/models/test.type';

@Component({
  selector: 'vtm-emission-details',
  templateUrl: './emission-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmissionDetailsComponent implements OnInit {

  @Input() testType: TestType;

  constructor() {
  }

  ngOnInit() {
  }

}
