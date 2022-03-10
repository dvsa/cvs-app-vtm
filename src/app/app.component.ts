///<reference path="govuk.d.ts">
import { Component } from '@angular/core';
import { initAll } from 'govuk-frontend/govuk/all';
import { EventMessage, EventType } from '@azure/msal-browser';
import { MsalService, MsalBroadcastService, } from "@azure/msal-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'vtm';

  constructor(private msalBroadcastService: MsalBroadcastService) {}

  ngOnInit() {
    initAll();


    this.msalBroadcastService.msalSubject$
        .subscribe((result: any) => {
            console.log(result);
        });
  }
}
