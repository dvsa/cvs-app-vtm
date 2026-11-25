import { Injectable, inject } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private msalService = inject(MsalService);
	private msalBroadcast = inject(MsalBroadcastService);

	private destroy$ = new Subject<void>();
	private isAuthenticated$ = new Subject<boolean>();

	constructor() {
		this.initAuthListener();
	}

	private initAuthListener() {
		this.msalBroadcast.inProgress$
			.pipe(
				filter((state) => state === 'none'),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {
				this.updateAuthState();
			});
	}

	private updateAuthState() {
		const account = this.getAccount();
		this.isAuthenticated$.next(!!account);
	}

	getAccount(): AccountInfo | null {
		const accounts = this.msalService.instance.getAllAccounts();
		return accounts.length > 0 ? accounts[0] : null;
	}

	getIsAuthenticated$(): Observable<boolean> {
		return this.isAuthenticated$.asObservable();
	}

	login(): void {
		this.msalService.loginPopup({
			scopes: [],
		});
	}

	logout(): void {
		this.msalService.logout({
			account: this.getAccount() || undefined,
		});
	}

	destroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
