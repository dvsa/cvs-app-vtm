///<reference path="govuk.d.ts">
import { Component } from '@angular/core';
import { initAll } from 'govuk-frontend/govuk/all';
import { EventMessage, EventType } from '@azure/msal-browser';
import { MsalService, MsalBroadcastService, } from "@azure/msal-angular";
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'vtm';
  userName = 'test';

  constructor(private msalBroadcastService: MsalBroadcastService, private msal: MsalService) {}

  ngOnInit() {
    initAll();

    this.msalBroadcastService.msalSubject$
        .pipe(
            filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
        )
        .subscribe((result: any) => {
            this.userName = result.payload.account.name;
        });
  }

  logOut() {
    this.msal.logout();
  }
}
