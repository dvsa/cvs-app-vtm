///<reference path="govuk.d.ts">
import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user-service/user-service';
import { initAll } from 'govuk-frontend/govuk/all';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public userService: UserService, private loadingService: LoadingService) {}

  ngOnInit() {
    initAll();
  }

  get loading() {
    return this.loadingService.showSpinner$;
  }
}
