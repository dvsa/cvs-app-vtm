import { TestBed } from '@angular/core/testing';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import type { AccountInfo } from '@azure/msal-browser';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
	let service: AuthService;
	let msalService: MsalService;
	let inProgress$: Subject<InteractionStatus>;
	let getAllAccountsSpy: ReturnType<typeof vi.fn>;

	const mockAccount = { username: 'test-user' } as AccountInfo;

	beforeEach(() => {
		inProgress$ = new Subject<InteractionStatus>();
		getAllAccountsSpy = vi.fn().mockReturnValue([]);

		TestBed.configureTestingModule({
			providers: [
				{
					provide: MsalService,
					useValue: {
						instance: {
							getAllAccounts: getAllAccountsSpy,
						},
						loginPopup: vi.fn(),
						logout: vi.fn(),
					},
				},
				{
					provide: MsalBroadcastService,
					useValue: {
						inProgress$,
					},
				},
			],
		});

		service = TestBed.inject(AuthService);
		msalService = TestBed.inject(MsalService);
	});

	afterEach(() => {
		service.destroy();
		vi.restoreAllMocks();
	});

	it('should create the service', () => {
		expect(service).toBeTruthy();
	});

	describe('getAccount', () => {
		it('should return null when there are no accounts', () => {
			getAllAccountsSpy.mockReturnValue([]);
			expect(service.getAccount()).toBeNull();
		});

		it('should return the first account when accounts exist', () => {
			getAllAccountsSpy.mockReturnValue([mockAccount, { username: 'other' } as AccountInfo]);
			expect(service.getAccount()).toEqual(mockAccount);
		});
	});

	describe('getIsAuthenticated$', () => {
		it('should emit true once the broadcast reaches "none" interaction status and an account exists', () => {
			getAllAccountsSpy.mockReturnValue([mockAccount]);
			const emissions: boolean[] = [];
			service.getIsAuthenticated$().subscribe((value) => emissions.push(value));

			inProgress$.next(InteractionStatus.Login);
			inProgress$.next(InteractionStatus.None);

			expect(emissions).toEqual([true]);
		});

		it('should emit false once the broadcast reaches "none" interaction status and no account exists', () => {
			getAllAccountsSpy.mockReturnValue([]);
			const emissions: boolean[] = [];
			service.getIsAuthenticated$().subscribe((value) => emissions.push(value));

			inProgress$.next(InteractionStatus.None);

			expect(emissions).toEqual([false]);
		});

		it('should not emit while the interaction status is not "none"', () => {
			const emissions: boolean[] = [];
			service.getIsAuthenticated$().subscribe((value) => emissions.push(value));

			inProgress$.next(InteractionStatus.Login);
			inProgress$.next(InteractionStatus.Logout);
			inProgress$.next(InteractionStatus.HandleRedirect);

			expect(emissions).toEqual([]);
		});

		it('should stop emitting after destroy is called', () => {
			getAllAccountsSpy.mockReturnValue([mockAccount]);
			const emissions: boolean[] = [];
			service.getIsAuthenticated$().subscribe((value) => emissions.push(value));

			service.destroy();
			inProgress$.next(InteractionStatus.None);

			expect(emissions).toEqual([]);
		});
	});

	describe('login', () => {
		it('should call msalService.loginPopup with no scopes', () => {
			const loginPopupSpy = vi.spyOn(msalService, 'loginPopup');
			service.login();
			expect(loginPopupSpy).toHaveBeenCalledWith({ scopes: [] });
		});
	});

	describe('logout', () => {
		it('should call msalService.logout with the current account', () => {
			getAllAccountsSpy.mockReturnValue([mockAccount]);
			const logoutSpy = vi.spyOn(msalService, 'logout');

			service.logout();

			expect(logoutSpy).toHaveBeenCalledWith({ account: mockAccount });
		});

		it('should call msalService.logout with undefined when there is no account', () => {
			getAllAccountsSpy.mockReturnValue([]);
			const logoutSpy = vi.spyOn(msalService, 'logout');

			service.logout();

			expect(logoutSpy).toHaveBeenCalledWith({ account: undefined });
		});
	});

	describe('destroy', () => {
		it('should complete the destroy subject so subsequent broadcasts are ignored', () => {
			const completeSpy = vi.fn();
			service.getIsAuthenticated$().subscribe({ complete: completeSpy });

			service.destroy();

			// destroy$ completing shouldn't complete isAuthenticated$ itself, but further
			// broadcast emissions must no longer trigger updateAuthState.
			getAllAccountsSpy.mockReturnValue([mockAccount]);
			inProgress$.next(InteractionStatus.None);

			expect(getAllAccountsSpy).not.toHaveBeenCalled();
		});
	});
});
