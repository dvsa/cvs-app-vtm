import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';

@Component({
  selector: 'app-adr-examiner-notes-history-view',
  templateUrl: './adr-examiner-notes-history-view.component.html',
  styleUrls: ['./adr-examiner-notes-history-view.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AdrExaminerNotesHistoryViewComponent,
      multi: true,
    },
  ],
})
export class AdrExaminerNotesHistoryViewComponent extends BaseControlComponent {
}
