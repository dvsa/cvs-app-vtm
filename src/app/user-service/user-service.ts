import { Injectable, OnDestroy } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { Store } from '@ngrx/store';
import { map, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as UserServiceActions from './user-service.actions';
import { UserServiceState } from './user-service.reducer';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {

  private userServiceOb: Observable<UserServiceState>;
  private readonly _destroying$ = new Subject<void>();

  constructor(private store: Store<{ userservice: UserServiceState }>, private msalBroadcastService: MsalBroadcastService, private msal: MsalService) {

    this.msalBroadcastService.msalSubject$
        .pipe(
            filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
            takeUntil(this._destroying$)
        )
        .subscribe((result: any) => {
            this.logIn(result.payload.account.name);
        });

    this.userServiceOb = this.store.select('userservice');
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }

  logIn(name: string): void {
   this.store.dispatch(UserServiceActions.Login({'name': name }));
  }

  getUserName$(): Observable<string> {
   return this.userServiceOb.pipe(map((state: UserServiceState) => state.username));
  }

  logOut(): void {
    this.store.dispatch(UserServiceActions.Logout());
    this.msal.logout();
  }
}
