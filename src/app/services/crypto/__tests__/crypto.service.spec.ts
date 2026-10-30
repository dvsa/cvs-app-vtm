import { TestBed } from '@angular/core/testing';
import { CryptoService } from '../crypto.service';

describe('CryptoService', () => {
	let service: CryptoService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CryptoService);
	});

	it('should create the service', () => {
		expect(service).toBeTruthy();
	});

	describe('sha256Hash', () => {
		it('should return the known SHA-256 hex digest for a given string', async () => {
			// Known SHA-256 digest for the string "hello"
			const result = await service.sha256Hash('hello');
			expect(result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
		});

		it('should return the known SHA-256 hex digest for an empty string', async () => {
			const result = await service.sha256Hash('');
			expect(result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
		});

		it('should return a 64 character hex string', async () => {
			const result = await service.sha256Hash('some arbitrary input');
			expect(result).toHaveLength(64);
			expect(result).toMatch(/^[0-9a-f]{64}$/);
		});

		it('should return different hashes for different inputs', async () => {
			const first = await service.sha256Hash('input-one');
			const second = await service.sha256Hash('input-two');
			expect(first).not.toBe(second);
		});

		it('should return the same hash for the same input (deterministic)', async () => {
			const first = await service.sha256Hash('repeatable input');
			const second = await service.sha256Hash('repeatable input');
			expect(first).toBe(second);
		});

		it('should correctly hash a string containing unicode characters', async () => {
			const result = await service.sha256Hash('héllo wörld 🌍');
			expect(result).toHaveLength(64);
			expect(result).toMatch(/^[0-9a-f]{64}$/);
		});
	});
});
