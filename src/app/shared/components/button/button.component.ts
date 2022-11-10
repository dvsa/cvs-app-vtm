import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent extends RouterLink {
  @Input() id?: string;
  @Input() disabled = false;
  @Input() type: 'link' | 'button' = 'button';
  @Input() design: '' | 'secondary' | 'warning' | 'link' = '';

  @Output() clicked = new EventEmitter();
}
