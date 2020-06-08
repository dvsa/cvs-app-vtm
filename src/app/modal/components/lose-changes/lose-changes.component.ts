import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ModalContent } from '../../modal.model';
import { APP_MODALS } from '../../../app.enums';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '@app/modal/modal.component';

@Component({
  selector: 'vtm-lose-changes',
  templateUrl: './lose-changes.component.html',
  styleUrls: ['./lose-changes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoseChangesComponent implements OnInit {
  // @Output() okCancelAction = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<LoseChangesComponent>) {}

  ngOnInit() {}

  onLoseChangesClick() {
    // this.okCancelAction.emit(true);
    this.dialogRef.close(true);
  }

  onCancelClick() {
    // this.okCancelAction.emit(false);
    this.dialogRef.close(false);
  }
}
