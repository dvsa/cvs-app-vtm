import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss']
})
export class BaseDialogComponent {
  @Output() action = new EventEmitter<string>();
  display: boolean = false;

  handleAction(action: string) {
    this.action.emit(action);
  }
}
