import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import type { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { AuthService } from '@services/auth/auth.service';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { LoginComponent } from '../login.component';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let authServiceMock: { getAccount: ReturnType<typeof vi.fn>; login: ReturnType<typeof vi.fn> };
	let routerMock: { navigate: ReturnType<typeof vi.fn> };
	let inProgress$: Subject<InteractionStatus>;

	beforeEach(() => {
		inProgress$ = new Subject<InteractionStatus>();

		authServiceMock = {
			getAccount: vi.fn().mockReturnValue(null),
			login: vi.fn(),
		};

		routerMock = {
			navigate: vi.fn(),
		};

		TestBed.configureTestingModule({
			imports: [LoginComponent],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: MsalBroadcastService, useValue: { inProgress$ } },
				{ provide: Router, useValue: routerMock },
			],
		});

		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should default isLoading to false', () => {
		fixture.detectChanges();
		expect(component.isLoading).toBe(false);
	});

	describe('ngOnInit', () => {
		it('should navigate to the root route when an account exists once interaction is "none"', () => {
			authServiceMock.getAccount.mockReturnValue({ username: 'test-user' } as AccountInfo);
			fixture.detectChanges();

			inProgress$.next('none' as InteractionStatus);

			expect(authServiceMock.getAccount).toHaveBeenCalled();
			expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
		});

		it('should not navigate when no account exists once interaction is "none"', () => {
			authServiceMock.getAccount.mockReturnValue(null);
			fixture.detectChanges();

			inProgress$.next('none' as InteractionStatus);

			expect(routerMock.navigate).not.toHaveBeenCalled();
		});

		it('should not check the account while interaction is still in progress', () => {
			fixture.detectChanges();

			inProgress$.next('login' as InteractionStatus);

			expect(authServiceMock.getAccount).not.toHaveBeenCalled();
			expect(routerMock.navigate).not.toHaveBeenCalled();
		});

		it('should stop listening for broadcast updates after the component is destroyed', () => {
			authServiceMock.getAccount.mockReturnValue({ username: 'test-user' } as AccountInfo);
			fixture.detectChanges();

			component.ngOnDestroy();
			inProgress$.next('none' as InteractionStatus);

			expect(authServiceMock.getAccount).not.toHaveBeenCalled();
			expect(routerMock.navigate).not.toHaveBeenCalled();
		});
	});

	describe('login', () => {
		it('should set isLoading to true and call authService.login()', () => {
			fixture.detectChanges();

			component.login();

			expect(component.isLoading).toBe(true);
			expect(authServiceMock.login).toHaveBeenCalledTimes(1);
		});

		it('should call authService.login() when the login button is clicked', () => {
			fixture.detectChanges();
			const button: HTMLButtonElement = fixture.nativeElement.querySelector('.login-button');

			button.click();
			fixture.detectChanges();

			expect(authServiceMock.login).toHaveBeenCalledTimes(1);
			expect(button.disabled).toBe(true);
			expect(button.textContent).toContain('Signing in...');
		});
	});

	describe('ngOnDestroy', () => {
		it('should complete the destroy subject without throwing', () => {
			fixture.detectChanges();
			expect(() => component.ngOnDestroy()).not.toThrow();
		});
	});
});
