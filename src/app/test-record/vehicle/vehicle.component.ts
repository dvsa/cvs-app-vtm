import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestResultModel } from '@app/models/test-result.model';
import { Preparer } from '@app/models/preparer';
import {VIEW_STATE} from '@app/app.enums';

@Component({
  selector: 'vtm-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleComponent implements OnInit {
  @Input() testRecord: TestResultModel;
  @Input() preparers: Preparer[];
  @Input() editState: VIEW_STATE;
  @Input() formErrors: string[];
  @Input() isSubmitted: boolean;

  constructor() {}

  ngOnInit() {}
}
