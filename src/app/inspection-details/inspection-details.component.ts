import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

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
