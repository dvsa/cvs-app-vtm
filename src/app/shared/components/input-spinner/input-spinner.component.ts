import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-spinner',
  templateUrl: './input-spinner.component.html',
  styleUrls: ['./input-spinner.component.scss']
})
export class InputSpinnerComponent {
  @Input() isValid: string = '';

  constructor() {}
}
