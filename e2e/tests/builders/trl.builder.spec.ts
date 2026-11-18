import { isValidObject } from '@dvsa/cvs-type-definitions/schema-validator';
import { expect, test } from '@playwright/test';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';

test('complete trailer satisfies the runtime schema including conditional multi-axle dimensions', () => {
	const record = new TrlBuilder().complete().withTrailerId().build();

	expect(isValidObject('v3/tech-record/put/trl/complete/index.json', structuredClone(record), true)).toEqual([]);
});

test('withPartialVin sets a matching VIN and partial VIN pair', () => {
	const partialVin = 'ABC123';
	const record = new TrlBuilder().skeleton().withPartialVin(partialVin).build();

	expect(record.partialVin).toBe(partialVin);
	expect(record.vin).toHaveLength(17);
	expect(record.vin.endsWith(partialVin)).toBe(true);
});
