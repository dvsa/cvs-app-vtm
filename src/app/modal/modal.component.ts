import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';
import { APP_MODALS } from '../app.enums';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
  MatDialog
} from '@angular/material/dialog';
import { ModalContent } from './modal.model';
import { LoseChangesComponent } from './components/lose-changes/lose-changes.component';
import { ModalState } from './modal.reducer';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'vtm-modal',
  template: `
    <div></div>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnChanges {
  @Input() modalState: ModalState;
  @Output() modalChange: EventEmitter<ModalContent>;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.modalState) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '45vw';

      let currentDialog: MatDialogRef<any>;
      if (this.modalState.currentModal === APP_MODALS.LOSE_CHANGES) {
        currentDialog = this.dialog.open(LoseChangesComponent, dialogConfig);
        currentDialog.afterClosed().subscribe((loseChanges) => {
          if (loseChanges) {
            this.modalChange.emit({
              modal: this.modalState.currentModal,
              urlToRedirect: this.modalState.currentRoute,
              status: loseChanges
            });
            console.log({
              modal: this.modalState.currentModal,
              urlToRedirect: this.modalState.currentRoute,
              status: loseChanges
            });
          }
        });
      }
    }
  }
}
