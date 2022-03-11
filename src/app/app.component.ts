///<reference path="govuk.d.ts">
import { Component } from '@angular/core';
import { initAll } from 'govuk-frontend/govuk/all';
import { EventMessage, EventType } from '@azure/msal-browser';
import { MsalService, MsalBroadcastService, } from "@azure/msal-angular";
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'vtm';
  userName = 'test';
  private readonly _destroying$ = new Subject<void>();

  constructor(private msalBroadcastService: MsalBroadcastService, private msal: MsalService) {}

  ngOnInit() {
    initAll();

    this.msalBroadcastService.msalSubject$
        .pipe(
            filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
            takeUntil(this._destroying$)
        )
        .subscribe((result: any) => {
            this.userName = result.payload.account.name;
        });
  }


  ngOnDestroy(): void {
      this._destroying$.next();
      this._destroying$.complete();
  }

  logOut() {
    this.msal.logout();
  }
}
