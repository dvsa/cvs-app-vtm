import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogBoxComponent } from '@app/shared/dialog-box/dialog-box.component';

export interface DialogData {
  context: string;
  actionName: string;
}

@Component({
  selector: 'vtm-dialog-box-confirmation',
  templateUrl: './dialog-box-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogBoxConfirmationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {}

  close(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    this.dialogRef.close(true);
  }

}
