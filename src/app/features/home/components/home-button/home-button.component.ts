import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.scss']
})
export class HomeButtonComponent {
  @Input() url: string = '';
  @Input() linkText: string = '';
  @Input() description: string = '';

  constructor() {}
}
