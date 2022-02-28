import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalContent, ModalPayload } from './modal.model';

@Component({
  selector: 'vtm-modal',
  template: `
    <ng-container *ngIf="currentModal.modal === 'lose-changes'">
      <vtm-lose-changes (okCancelAction)="okCancelAction($event)"></vtm-lose-changes>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit {
  public currentModal: ModalContent;

  constructor(@Inject(MAT_DIALOG_DATA) data, public dialogRef: MatDialogRef<ModalComponent>) {
    this.currentModal = {
      modal: data.currentModal
    } as ModalContent;
  }

  ngOnInit() {}

  okCancelAction(result: ModalPayload) {
    this.dialogRef.close({
      ...this.currentModal,
      status: result.isOk,
      payload: result.payload
    });
  }
}
