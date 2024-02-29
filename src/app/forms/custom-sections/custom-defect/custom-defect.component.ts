import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-custom-defect[index][form]',
  templateUrl: './custom-defect.component.html',
  styleUrls: ['./custom-defect.component.scss'],
})
export class CustomDefectComponent {
  @Input() form!: CustomFormGroup;
  @Input() index!: number;
  @Input() isEditing = false;
  @Input() templateName?: string;
  @Output() removeCustomDefect = new EventEmitter<number>();
}
