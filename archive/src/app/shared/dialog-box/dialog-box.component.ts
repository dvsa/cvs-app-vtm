import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '@app/models/dialog-data';

@Component({
  selector: 'vtm-dialog-box',
  templateUrl: './dialog-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogBoxComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {}

  close(): void {
    this.dialogRef.close(false);
  }

  save(modalData: string): void {
    this.dialogRef.close({ isSave: true, data: modalData });
  }
}
