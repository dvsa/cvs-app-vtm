import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { APP_MODALS } from '../app.enums';
import { IAppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { ModalComponent } from './modal.component';
import { ModalState } from './modal.reducer';
import { Observable } from 'rxjs';
import { getCurrentModalState } from './modal.selectors';
import { ResetModal } from './modal.actions';
import { ModalContent } from './modal.model';


@Component({
  selector: 'vtm-modal-container',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalContainerComponent implements OnInit {
  modalState$: Observable<ModalState>;
  constructor(public dialog: MatDialog, private store: Store<IAppState>) {
    this.modalState$ = this.store.select(getCurrentModalState);
  }

  ngOnInit() {
    this.modalState$.subscribe((modal: ModalState) => {
      if (modal.currentModal !== APP_MODALS.NONE) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '45vw';
        dialogConfig.data = {
          currentModal: modal.currentModal
        };
        const dialogRef = this.dialog.open(ModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
          this.modalHandler({ ...result, urlToRedirect: modal.urlToRedirect });
        });
      } else {
        this.dialog.closeAll();
      }
    });
  }

  modalHandler(modalContent: ModalContent) {
        if (modalContent.status) {
          this.store.dispatch(new ResetModal(modalContent.payload));
        }
  }
}
