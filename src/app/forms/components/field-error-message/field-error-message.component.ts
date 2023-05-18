import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormNodeWidth } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-field-error-message',
  templateUrl: './field-error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldErrorMessageComponent {
  @Input() name: string = '';
  @Input() error?: string | null;
  @Input() width?: FormNodeWidth;

  get style(): string {
    return this.width ? 'width-' + this.width : '';
  }
}
