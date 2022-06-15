import { Injectable, OnDestroy } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as UserServiceActions from '../../store/user/user-service.actions';
import * as UserServiceState from '../../store/user/user-service.reducer';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  private readonly _destroying$ = new Subject<void>();

  constructor(private store: Store, private msalBroadcastService: MsalBroadcastService, private msal: MsalService) {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: any) => {
        console.log(result);
        const {
          payload: {
            account: {
              name,
              username,
              idTokenClaims: { oid }
            }
          }
        } = result;
        this.logIn({ name, username, oid });
      });
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }

  logIn({ name, username, oid }: { name: string; username: string; oid: string }): void {
    this.store.dispatch(UserServiceActions.Login({ name: name, oid, username }));
  }

  get name$(): Observable<string> {
    return this.store.pipe(select(UserServiceState.name));
  }

  get userName$(): Observable<string> {
    return this.store.pipe(select(UserServiceState.username));
  }

  get id$(): Observable<string | undefined> {
    return this.store.pipe(select(UserServiceState.id));
  }

  logOut(): void {
    this.store.dispatch(UserServiceActions.Logout());
    this.msal.logout();
  }
}
