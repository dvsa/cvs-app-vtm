import { Injectable } from '@angular/core';
import { gzip, ungzip } from 'pako';

@Injectable({ providedIn: 'root' })
export class CompressionService {
	private readonly encoder = new TextEncoder();
	private readonly decoder = new TextDecoder();

	extract<T>(compressedData: string): T {
		const unzippedJson = this.decoder.decode(ungzip(CompressionService.fromBase64(compressedData)));
		return JSON.parse(unzippedJson);
	}

	compress<T>(data: T): string {
		const jsonString = JSON.stringify(data);
		// JSON.stringify(undefined) is undefined; throw so the caller sends the request uncompressed
		if (jsonString === undefined) {
			throw new TypeError('Cannot compress a value that does not serialise to JSON');
		}
		return CompressionService.toBase64(gzip(this.encoder.encode(jsonString)));
	}

	// btoa/atob work on binary strings; convert in chunks so large payloads don't overflow the call stack
	private static toBase64(bytes: Uint8Array): string {
		let binary = '';
		for (let i = 0; i < bytes.length; i += 0x8000) {
			binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
		}
		return btoa(binary);
	}

	private static fromBase64(base64: string): Uint8Array {
		const binary = atob(base64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes;
	}
}
