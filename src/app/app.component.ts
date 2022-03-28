///<reference path="govuk.d.ts">
import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend/govuk/all';
import { UserService } from './user-service/user-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vtm';

  constructor(public userService: UserService) {}

  ngOnInit() {
    initAll();
  }
}
