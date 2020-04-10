import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  response: string;
  context: string;
}

@Component({
  selector: 'vtm-adr-reason-modal',
  templateUrl: './adr-reason-modal.component.html',
  styleUrls: ['./adr-reason-modal.component.scss']
})
export class AdrReasonModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AdrReasonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close(): void {
    this.dialogRef.close(false);
  }

  save(modalData:  string): void {
    this.dialogRef.close({isSave: true, data: modalData});
  }
}
