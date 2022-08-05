///<reference path="govuk.d.ts">
import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user-service/user-service';
import { initAll } from 'govuk-frontend/govuk/all';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(public userService: UserService) {}

  ngOnInit() {
    initAll();
  }
}
