import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page-button',
  templateUrl: './landing-page-button.component.html',
  styleUrls: ['./landing-page-button.component.scss']
})
export class LandingPageButtonComponent implements OnInit {
  @Input() url: string = '';
  @Input() linkText: string = '';
  @Input() description: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
