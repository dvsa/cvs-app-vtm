import { Injectable, OnDestroy, inject } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { Store, select } from '@ngrx/store';
import * as UserServiceActions from '@store/user/user-service.actions';
import * as UserServiceState from '@store/user/user-service.reducer';
import { jwtDecode } from 'jwt-decode';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
	store = inject(Store);
	msalBroadcastService = inject(MsalBroadcastService);
	msal = inject(MsalService);

	private readonly destroying$ = new Subject<void>();

	id$ = this.store.pipe(select(UserServiceState.id));
	user$ = this.store.pipe(select(UserServiceState.user));
	name$ = this.store.pipe(select(UserServiceState.name));
	roles$ = this.store.pipe(select(UserServiceState.roles));
	userEmail$ = this.store.pipe(select(UserServiceState.userEmail));
	inProgress$ = this.msalBroadcastService.inProgress$;

	constructor() {
		this.msalBroadcastService.msalSubject$
			.pipe(
				filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
				takeUntil(this.destroying$)
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
					name,
					userEmail,
					oid,
					accessToken,
				});
			});
	}

	ngOnDestroy(): void {
		this.destroying$.next();
		this.destroying$.complete();
	}

	logIn({
		name,
		userEmail,
		oid,
		accessToken,
	}: { name: string; userEmail: string; oid: string; accessToken: string }): void {
		window.localStorage.setItem('accessToken', accessToken);
		const decodedJWT = jwtDecode(accessToken);
		const { roles } = decodedJWT as { roles?: string[] };
		this.store.dispatch(
			UserServiceActions.Login({
				name,
				userEmail,
				oid,
				roles,
			})
		);
	}

	logOut(): void {
		this.store.dispatch(UserServiceActions.Logout());
		this.msal.logout();
	}
}
