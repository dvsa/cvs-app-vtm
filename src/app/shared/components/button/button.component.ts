import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() id?: string;
  @Input() disabled = false;
  @Input() type: '' | 'secondary' | 'warning' | 'link' = '';

  @Output() clicked = new EventEmitter();

  constructor() {}
}
