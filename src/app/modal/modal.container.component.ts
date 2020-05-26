import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { APP_MODALS } from '../app.enums';
import { IAppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { getCurrentModalState } from './modal.selectors';
import { Observable } from 'rxjs';
import { ModalComponent } from './modal.component';
import { ModalState } from './modal.reducer';

@Component({
  selector: 'vtm-modal-container',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalContainerComponent implements OnInit {
  @Input() currentModal$: Observable<ModalState>;
  constructor(private dialog: MatDialog, private store: Store<IAppState>) {}

  ngOnInit() {
    this.currentModal$ = this.store.select(getCurrentModalState);

    this.currentModal$.subscribe((modal: ModalState) => {
      if (modal.currentModal !== APP_MODALS.NONE) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '45vw';
        dialogConfig.data = {
          currentModal: modal.currentModal,
          currentRoute: modal.currentRoute
        };
        this.dialog.open(ModalComponent, dialogConfig);
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
