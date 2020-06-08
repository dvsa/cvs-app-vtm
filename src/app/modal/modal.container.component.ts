import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { APP_MODALS } from '../app.enums';
import { IAppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { getCurrentModalState } from './modal.selectors';
import { Observable } from 'rxjs';
import { ModalComponent } from './modal.component';
import { ModalState } from './modal.reducer';
import { ModalContent } from './modal.model';
import { ChangeView } from './modal.actions';

@Component({
  selector: 'vtm-modal-container',
  template: `
    <ng-container *ngIf="currentModal$ | async as currentModal">
      <vtm-modal
        [modalState]="currentModal"
        (modalChange)="modalChangeHandler($event)"
      ></vtm-modal>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalContainerComponent implements OnInit {
  currentModal$: Observable<ModalState>;
  constructor(private store: Store<IAppState>) {
    this.currentModal$ = this.store.select(getCurrentModalState);
    // this.currentModal$.subscribe((val) => {
    //   console.log('modal: ', val);
    // });
  }

  ngOnInit() {
    // this.currentModal$.subscribe((modal: ModalState) => {
    //   if (modal.currentModal !== APP_MODALS.NONE) {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.disableClose = true;
    //     dialogConfig.autoFocus = true;
    //     dialogConfig.width = '45vw';
    //     dialogConfig.data = {
    //       currentModal: modal.currentModal,
    //       currentRoute: modal.currentRoute
    //     };
    //     this.dialog.open(ModalComponent, dialogConfig);
    //   } else {
    //     this.dialog.closeAll();
    //   }
    // });
  }

  modalChangeHandler(modalContent: ModalContent) {
    switch (modalContent.modal) {
      case APP_MODALS.LOSE_CHANGES:
        this.store.dispatch(
          new ChangeView({
            currentModal: APP_MODALS.LOSE_CHANGES,
            currentRoute: modalContent.urlToRedirect
          })
        );
    }
  }
}
