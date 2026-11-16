import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { CryptoService } from '@services/crypto/crypto.service';
import { UserService } from '@services/user-service/user-service';
import { of, throwError } from 'rxjs';
import { AnalyticsService } from '../analytics.service';

describe('AnalyticsService', () => {
	let service: AnalyticsService;
	let dataLayer: unknown[];
	const userService = {
		userEmail$: of('tester@example.com'),
		id$: of<string | undefined>('user-id'),
		employeeId: vi.fn<() => string | null>(),
	};
	const cryptoService = { sha256Hash: vi.fn<(value: string) => Promise<string>>() };

	beforeEach(() => {
		dataLayer = [];
		vi.stubGlobal('dataLayer', dataLayer);
		vi.spyOn(environment, 'production', 'get').mockReturnValue(false);
		userService.userEmail$ = of('tester@example.com');
		userService.id$ = of('user-id');
		userService.employeeId.mockReturnValue(null);
		cryptoService.sha256Hash.mockResolvedValue('hashed-id');
		TestBed.configureTestingModule({
			providers: [
				{ provide: UserService, useValue: userService },
				{ provide: CryptoService, useValue: cryptoService },
			],
		});
		service = TestBed.inject(AnalyticsService);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it('hashes the email outside production and publishes only the hash', async () => {
		await service.setUserId();

		expect(cryptoService.sha256Hash).toHaveBeenCalledExactlyOnceWith('tester@example.com');
		expect(dataLayer).toEqual([{ UserIDDataLayer: 'hashed-id' }]);
		expect(userService.employeeId).not.toHaveBeenCalled();
	});

	it('prefers the employee ID in production without subscribing to the user ID', async () => {
		vi.spyOn(environment, 'production', 'get').mockReturnValue(true);
		userService.employeeId.mockReturnValue('employee-id');
		userService.id$ = throwError(() => new Error('User ID must not be read'));

		expect(await service.createUniqueId()).toBe('hashed-id');
		expect(cryptoService.sha256Hash).toHaveBeenCalledExactlyOnceWith('employee-id');
	});

	it('falls back to the user ID in production when the employee ID is missing', async () => {
		vi.spyOn(environment, 'production', 'get').mockReturnValue(true);

		expect(await service.createUniqueId()).toBe('hashed-id');
		expect(cryptoService.sha256Hash).toHaveBeenCalledExactlyOnceWith('user-id');
	});

	it('returns N/A without hashing when neither production identifier is available', async () => {
		vi.spyOn(environment, 'production', 'get').mockReturnValue(true);
		userService.id$ = of(undefined);

		expect(await service.createUniqueId()).toBe('N/A');
		expect(cryptoService.sha256Hash).not.toHaveBeenCalled();
	});

	it('does not publish an identity when hashing fails', async () => {
		const error = new Error('Hashing failed');
		cryptoService.sha256Hash.mockRejectedValue(error);

		await expect(service.setUserId()).rejects.toBe(error);
		expect(dataLayer).toEqual([]);
	});

	it('propagates identity stream errors without publishing data', async () => {
		const error = new Error('Identity unavailable');
		userService.userEmail$ = throwError(() => error);

		await expect(service.setUserId()).rejects.toBe(error);
		expect(cryptoService.sha256Hash).not.toHaveBeenCalled();
		expect(dataLayer).toEqual([]);
	});

	it('can run before the analytics data layer is available', () => {
		vi.stubGlobal('dataLayer', undefined);

		expect(() => service.pushToDataLayer({ event: 'test' })).not.toThrow();
	});
});
