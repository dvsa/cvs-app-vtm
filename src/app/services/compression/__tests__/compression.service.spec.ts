import { TestBed } from '@angular/core/testing';
import { ungzip } from 'pako';
import { CompressionService } from '../compression.service';

describe('CompressionService', () => {
	let service: CompressionService;

	// produced by Node's zlib: gzipSync(Buffer.from(JSON.stringify(payload))).toString('base64')
	const payload = { vin: 'ABC123', make: 'Škoda', notes: '£50 – ünïcødé ✓', axles: [1, 2, 3] };
	const nodeZlibBase64 =
		'H4sIAAAAAAAAE6tWKsvMU7JScnRyNjQyVtJRyk3MTlWyUjq6IDs/JVFJRykvvyS1WMlK6dBiUwOFRw2TFQ7vyTu8PvnwjpTDKxUezZmspKOUWJEDUhJtqGOkYxxbCwCVUDDzUwAAAA==';

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CompressionService);
	});

	describe('extract', () => {
		it('should decode a base64 gzip payload produced by Node zlib', () => {
			expect(service.extract(nodeZlibBase64)).toEqual(payload);
		});

		it('should throw if the payload is not valid gzip', () => {
			expect(() => service.extract(btoa('not gzip'))).toThrow();
		});
	});

	describe('compress', () => {
		it('should produce base64 gzip of the JSON', () => {
			const compressed = service.compress(payload);
			const json = new TextDecoder().decode(ungzip(Uint8Array.from(atob(compressed), (char) => char.charCodeAt(0))));

			expect(JSON.parse(json)).toEqual(payload);
		});

		it('should round trip through extract', () => {
			expect(service.extract(service.compress(payload))).toEqual(payload);
		});

		it('should round trip a payload larger than one base64 chunk', () => {
			// pseudo-random values so the gzip output is well over the 32KB conversion chunk
			let seed = 1;
			const next = () => {
				seed = (seed * 1103515245 + 12345) % 2 ** 31;
				return seed.toString(36);
			};
			const large = { items: Array.from({ length: 10000 }, (_, i) => ({ id: i, value: `${next()}-ü-${next()}` })) };

			const compressed = service.compress(large);

			expect(atob(compressed).length).toBeGreaterThan(0x8000 * 2);
			expect(service.extract(compressed)).toEqual(large);
		});

		it('should throw for a value that does not serialise to JSON', () => {
			expect(() => service.compress(undefined)).toThrow(TypeError);
		});
	});
});
