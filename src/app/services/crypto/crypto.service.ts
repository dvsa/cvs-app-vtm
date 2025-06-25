import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CryptoService {
	/**
	 * Creates a SHA-256 hash of the input string and returns it as a hex string
	 * This is equivalent to: createHash('sha256').update(data).digest('hex')
	 */
	async sha256Hash(data: string): Promise<string> {
		// Convert the string to a buffer
		const encoder = new TextEncoder();
		const dataBuffer = encoder.encode(data);
		// Use the Web Crypto API to create the hash
		const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
		// Convert the buffer to hex string
		return Array.from(new Uint8Array(hashBuffer))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}
}
