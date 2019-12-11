import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FormGroupState} from 'ngrx-forms';
import {adrDetailsFormModel} from '@app/models/adrDetailsForm.model';
import {select, Store} from '@ngrx/store';
import {IAppState} from '@app/store/state/adrDetailsForm.state';

@Component({
  selector: 'vtm-inspection-details',
  templateUrl: './inspection-details.component.html',
  styleUrls: ['./inspection-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionDetailsComponent implements OnInit {
  @Input() inspectionType: any;
  @Input() type: any;
  @Input() periodicNumber: any;
  @Input() expiryDate: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
