import { Injectable, OnDestroy } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Store, select } from '@ngrx/store';
import jwt_decode from 'jwt-decode';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as UserServiceActions from '../../store/user/user-service.actions';
import * as UserServiceState from '../../store/user/user-service.reducer';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  private readonly destroying$ = new Subject<void>();

  constructor(private store: Store, private msalBroadcastService: MsalBroadcastService, private msal: MsalService) {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this.destroying$),
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((result: any) => {
        const {
          payload: {
            account: {
              name,
              idTokenClaims: { oid, preferred_username, email },
            },
            accessToken,
          },
        } = result;
        const userEmail = email || preferred_username;
        this.logIn({
          name, userEmail, oid, accessToken,
        });
      });
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }

  logIn({
    name, userEmail, oid, accessToken,
  }: { name: string; userEmail: string; oid: string; accessToken: string }): void {
    window.localStorage.setItem('accessToken', accessToken);
    const decodedJWT = jwt_decode(accessToken);
    const { roles } = decodedJWT as { roles: string[] };
    this.store.dispatch(UserServiceActions.Login({
      name, userEmail, oid, roles,
    }));
  }

  get name$(): Observable<string> {
    return this.store.pipe(select(UserServiceState.name));
  }

  get userEmail$(): Observable<string> {
    return this.store.pipe(select(UserServiceState.userEmail));
  }

  get id$(): Observable<string | undefined> {
    return this.store.pipe(select(UserServiceState.id));
  }

  get roles$(): Observable<string[] | null> {
    return this.store.pipe(select(UserServiceState.roles));
  }

  logOut(): void {
    this.store.dispatch(UserServiceActions.Logout());
    this.msal.logout();
  }

  get inProgress$(): Observable<InteractionStatus> {
    return this.msalBroadcastService.inProgress$;
  }

  get user$(): Observable<UserServiceState.UserServiceState> {
    return this.store.pipe(select(UserServiceState.user));
  }
}
