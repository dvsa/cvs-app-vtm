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
  @Input() type: 'link' | 'button' = 'button';
  @Input() design: '' | 'secondary' | 'warning' | 'link' = '';
  @Input() routerLink = [''];

  @Output() clicked = new EventEmitter();
}
