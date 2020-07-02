import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ModalPayload, ModalContent } from '@app/modal/modal.model';

@Component({
  selector: 'vtm-test-delete-reason-modal',
  templateUrl: './test-delete-reason-modal.component.html'
})
export class TestDeleteReasonModalComponent {
  @Output() okCancelAction = new EventEmitter<ModalPayload>();
  @Input() modalContent: ModalContent;
  constructor() {}

  close(): void {
    this.okCancelAction.emit({ isOk: false });
  }

  save(reason: string): void {
    this.okCancelAction.emit({ isOk: true, payload: reason });
  }
}
