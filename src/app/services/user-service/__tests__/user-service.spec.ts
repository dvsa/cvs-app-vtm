import { initialAppState } from '@/src/app/store';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as UserServiceActions from '@store/user/user-service.actions';
import { Logout } from '@store/user/user-service.actions';
import { of } from 'rxjs';
import { UserService } from '../user-service';

jest.mock('jwt-decode', () => ({
	jwtDecode: () => ({ roles: ['12345'] }),
}));

// remove when we update: @azure/msal-angular see: https://www.reddit.com/r/angular/comments/1gq82zc/browserautherror_crypto_nonexistent_the_crypto/
Object.defineProperty(global.self, 'crypto', {
	value: {
		// Needed for @azure/msal-browser
		subtle: {
			digest: jest.fn(),
		},
		getRandomValues: jest.fn(),
	},
});

describe('User-Service', () => {
	let service: UserService;
	let store: MockStore;
	let msalService: MsalService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				{
					provide: MsalService,
					useValue: {
						logout: jest.fn(),
					},
				},
				{
					provide: MsalBroadcastService,
					useValue: {
						msalSubject$: of(),
					},
				},
				provideMockStore({ initialState: initialAppState }),
			],
		});

		service = TestBed.inject(UserService);
		store = TestBed.inject(MockStore);
		msalService = TestBed.inject(MsalService);
	});

	it('should create the user service', () => {
		expect(service).toBeTruthy();
	});

	it('should dispatch the login action upon logging in', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		service.logIn({
			name: 'name',
			userEmail: 'name@mail.com',
			oid: '123',
			accessToken: '12345',
		});

		expect(dispatchSpy).toHaveBeenCalledWith(
			UserServiceActions.Login({
				name: 'name',
				userEmail: 'name@mail.com',
				oid: '123',
				roles: ['12345'],
			})
		);
	});

	it('should logout', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		const MsalSpy = jest.spyOn(msalService, 'logout').mockImplementation(() => of());
		service.logOut();
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(Logout());
		expect(MsalSpy).toHaveBeenCalledTimes(1);
	});
});
