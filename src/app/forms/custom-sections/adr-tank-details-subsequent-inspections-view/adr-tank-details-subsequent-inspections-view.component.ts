import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdrExaminerNotesHistoryViewComponent } from '../adr-examiner-notes-history-view/adr-examiner-notes-history-view.component';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-adr-tank-details-subsequent-inspections-view',
  templateUrl: './adr-tank-details-subsequent-inspections-view.component.html',
  styleUrls: ['./adr-tank-details-subsequent-inspections-view.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AdrExaminerNotesHistoryViewComponent,
      multi: true,
    },
  ],
})
export class AdrTankDetailsSubsequentInspectionsViewComponent extends CustomFormControlComponent {

}
