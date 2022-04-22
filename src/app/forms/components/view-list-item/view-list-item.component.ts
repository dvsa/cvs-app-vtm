import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-view-list-item',
  templateUrl: './view-list-item.component.html',
  styleUrls: ['./view-list-item.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ViewListItemComponent,
      multi: true
    }
  ]
})
export class ViewListItemComponent extends BaseControlComponent {
  constructor() {
    super();
  }
}
