import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ModalPayload } from '@app/modal/modal.model';

@Component({
  selector: 'vtm-lose-changes',
  templateUrl: './lose-changes.component.html',
  styleUrls: ['./lose-changes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoseChangesComponent implements OnInit {
  @Output() okCancelAction = new EventEmitter<ModalPayload>();

  constructor() {}

  ngOnInit() {}

  onLoseChangesClick() {
    this.okCancelAction.emit({ isOk: true});
  }

  onCancelClick() {
    this.okCancelAction.emit({ isOk: false });
  }
}
