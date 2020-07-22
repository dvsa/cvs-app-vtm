import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vtm-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutModalComponent {
  constructor(public dialogRef: MatDialogRef<LogoutModalComponent>) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
