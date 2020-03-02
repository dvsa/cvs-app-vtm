import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vtm-prevent-leave-page-modal',
  templateUrl: './prevent-leave-page-modal.component.html',
  styleUrls: ['./prevent-leave-page-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreventLeavePageModalComponent {

  constructor(
    public dialogRef: MatDialogRef<PreventLeavePageModalComponent>
  ) {
  }

  close(): void {
    this.dialogRef.close(false);
  }

  action(): void {
    this.dialogRef.close(true);
  }
}
