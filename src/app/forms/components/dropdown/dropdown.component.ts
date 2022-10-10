import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiOptions } from '@forms/models/options.model';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-dropdown[options]',
  templateUrl: './dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownComponent,
      multi: true
    }
  ]
})
export class DropdownComponent extends BaseControlComponent {
  @Input() options!: MultiOptions;
  @Input() isEditing = true;
}
