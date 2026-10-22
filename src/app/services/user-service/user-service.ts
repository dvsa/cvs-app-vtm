import { Injectable, OnDestroy, inject } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, IdTokenClaims } from '@azure/msal-browser';
import { Store, select } from '@ngrx/store';
import * as Sentry from '@sentry/angular';
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

	id = this.store.selectSignal(UserServiceState.id);
	user = this.store.selectSignal(UserServiceState.user);
	name = this.store.selectSignal(UserServiceState.name);
	roles = this.store.selectSignal(UserServiceState.roles);
	userEmail = this.store.selectSignal(UserServiceState.userEmail);
	employeeId = this.store.selectSignal(UserServiceState.employeeId);

	constructor() {
		this.id$.pipe(takeUntil(this.destroying$)).subscribe((oid) => {
			Sentry.setUser(oid ? { id: oid } : null);
		});

		this.msalBroadcastService.msalSubject$
			.pipe(
				filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
				takeUntil(this.destroying$)
			)
			.subscribe((result) => {
				const { accessToken, account } = result.payload as AuthenticationResult;
				const { oid, preferred_username, email, JobTitle } = account.idTokenClaims as IdTokenClaims & CustomClaims;

				this.logIn({
					name: account.name || '',
					userEmail: email || preferred_username,
					oid,
					accessToken,
					jobTitle: JobTitle,
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
		jobTitle,
	}: { name: string; userEmail: string; oid: string; accessToken: string; jobTitle?: string }): void {
		window.localStorage.setItem('accessToken', accessToken);
		const decodedJWT = jwtDecode(accessToken);
		const { roles, employeeid } = decodedJWT as { roles?: string[]; employeeid?: string };
		this.store.dispatch(
			UserServiceActions.Login({
				name,
				userEmail,
				oid,
				employeeId: employeeid ?? null,
				roles,
				jobTitle: jobTitle,
			})
		);
	}

	logOut(): void {
		this.store.dispatch(UserServiceActions.Logout());
		this.msal.logout();
	}
}

export type CustomClaims = {
	oid: string;
	email: string;
	preferred_username: string;
	JobTitle?: string;
};
