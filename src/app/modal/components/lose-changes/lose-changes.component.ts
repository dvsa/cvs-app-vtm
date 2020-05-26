import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ModalContent } from '../../modal.model';
import { APP_MODALS } from '../../../app.enums';

@Component({
  selector: 'vtm-lose-changes',
  templateUrl: './lose-changes.component.html',
  styleUrls: ['./lose-changes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoseChangesComponent implements OnInit {
  @Output() okCancelAction = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  onLoseChangesClick() {
    this.okCancelAction.emit(true);
  }

  onCancelClick() {
    this.okCancelAction.emit(false);
  }
}
