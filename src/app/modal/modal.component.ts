import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { APP_MODALS } from '../app.enums';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalContent } from './modal.model';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { ResetModal } from './modal.actions';
import { ModalContainerComponent } from './modal.container.component';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<ModalComponent>,
    private store: Store<IAppState>
  ) {
    this.currentModal = {
      modal: data.currentModal,
      urlToRedirect: data.currentRoute
    } as ModalContent;
  }

  ngOnInit() {}

  okCancelAction(isOk: boolean) {
    this.handleModal({ ...this.currentModal, status: isOk });
    this.dialogRef.close();
  }

  handleModal(modalContent: ModalContent) {
    switch (modalContent.modal) {
      case APP_MODALS.LOSE_CHANGES:
        const redirectUrl = modalContent.status ? modalContent.urlToRedirect : '';
        this.store.dispatch(new ResetModal(redirectUrl));
        return;
    }
  }
}
