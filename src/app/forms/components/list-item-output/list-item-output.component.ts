import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-list-item-output',
  templateUrl: './list-item-output.component.html',
  styleUrls: ['./list-item-output.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ListItemOutputComponent,
      multi: true
    }
  ]
})
export class ListItemOutputComponent extends BaseControlComponent {
  constructor() {
    super();
  }
}
