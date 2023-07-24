import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-field-error-message',
  templateUrl: './field-error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldErrorMessageComponent {
  @Input() name: string = '';
  @Input() error?: string | null;
}
