import { MsalService, MsalBroadcastService, } from "@azure/msal-angular";
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EventMessage, EventType } from '@azure/msal-browser';

@Injectable({ providedIn: 'root' })
export class UserService {

  username = "Unknown";
  private readonly _destroying$ = new Subject<void>();

  constructor(private msalBroadcastService: MsalBroadcastService, private msal: MsalService) {
    this.msalBroadcastService.msalSubject$
        .pipe(
            filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
            takeUntil(this._destroying$)
        )
        .subscribe((result: any) => {
            this.setUserName(result.payload.account.name);
        });
  }

  ngOnDestroy(): void {
      this._destroying$.next();
      this._destroying$.complete();
  }

  setUserName(name: string): void {
   this.username = name;
  }

  getUserName(): string {
    return this.username;
  }

  logOut(): void {
    this.msal.logout();
  }


}
