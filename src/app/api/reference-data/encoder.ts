import {HttpUrlEncodingCodec} from '@angular/common/http';

/**
 * CustomHttpUrlEncodingCodec
 * Fix plus sign (+) not encoding, so sent as blank space
 * See: https://github.com/angular/angular/issues/11058#issuecomment-247367318
 */
export class CustomHttpUrlEncodingCodec extends HttpUrlEncodingCodec {
	override encodeKey(key: string): string {
		const k = super.encodeKey(key);
		return k.replace(/\+/gi, '%2B');
	}

	override encodeValue(value: string): string {
		const v = super.encodeValue(value);
		return v.replace(/\+/gi, '%2B');
	}
}
