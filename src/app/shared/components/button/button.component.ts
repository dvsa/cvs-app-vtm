import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() id?: string;
  @Input() disabled = false;
  @Input() type: '' | 'secondary' | 'warning' | 'link' | 'underline' = '';

  @Output() clicked = new EventEmitter();

  constructor() {}
}
