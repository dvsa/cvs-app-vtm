import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { AuthService } from '@services/auth/auth.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	standalone: true,
})
export class LoginComponent implements OnInit {
	private authService = inject(AuthService);
	private msalBroadcast = inject(MsalBroadcastService);
	private router = inject(Router);
	private destroy$ = new Subject<void>();

	isLoading = false;

	ngOnInit() {
		this.msalBroadcast.inProgress$
			.pipe(
				filter((state) => state === 'none'),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {
				const account = this.authService.getAccount();
				if (account) {
					this.router.navigate(['/']);
				}
			});
	}

	login() {
		this.isLoading = true;
		this.authService.login();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
