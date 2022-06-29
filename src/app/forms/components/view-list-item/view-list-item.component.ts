import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormNodeViewTypes } from '../../services/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-view-list-item',
  templateUrl: './view-list-item.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ViewListItemComponent,
      multi: true
    }
  ]
})
export class ViewListItemComponent extends BaseControlComponent {
  get formNodeViewTypes(): typeof FormNodeViewTypes {
    return FormNodeViewTypes;
  }
}
