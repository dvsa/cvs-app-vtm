///<reference path="govuk.d.ts">
import { Component } from '@angular/core';
import { initAll } from 'govuk-frontend/govuk/all';
import { UserService } from './user-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'vtm';

  constructor(public userService: UserService) {}

  ngOnInit() {
    initAll();
  }
}
