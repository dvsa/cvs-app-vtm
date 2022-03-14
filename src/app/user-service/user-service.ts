import { MsalService, MsalBroadcastService, } from "@azure/msal-angular";
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EventMessage, EventType } from '@azure/msal-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setUsername } from './user-service.actions';

@Injectable({ providedIn: 'root' })
export class UserService {

  private userName: Observable<string>;
  private readonly _destroying$ = new Subject<void>();

  constructor(private store: Store<{ userName: string }>, private msalBroadcastService: MsalBroadcastService, private msal: MsalService) {
    this.msalBroadcastService.msalSubject$
        .pipe(
            filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
            takeUntil(this._destroying$)
        )
        .subscribe((result: any) => {
            this.setUserName(result.payload.account.name);
        });

    this.userName = store.select('userName');
  }

  ngOnDestroy(): void {
      this._destroying$.next();
      this._destroying$.complete();
  }

  setUserName(name: string): void {
   this.store.dispatch(setUsername({'name': name }));
  }

  getUserNameObservable(): Observable<string> {
   return this.userName;
  }

  logOut(): void {
    this.setUserName('');
    this.msal.logout();
  }
}
