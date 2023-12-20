import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { AdrExaminerNotesHistoryViewComponent } from '../adr-examiner-notes-history-view/adr-examiner-notes-history-view.component';

@Component({
  selector: 'app-adr-tank-details-initial-inspection-view',
  templateUrl: './adr-tank-details-initial-inspection-view.component.html',
  styleUrls: ['./adr-tank-details-initial-inspection-view.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AdrExaminerNotesHistoryViewComponent,
      multi: true,
    },
  ],
})
export class AdrTankDetailsInitialInspectionViewComponent extends BaseControlComponent {
}
