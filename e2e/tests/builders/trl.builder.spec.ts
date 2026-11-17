import { isValidObject } from '@dvsa/cvs-type-definitions/schema-validator';
import { expect, test } from '@playwright/test';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';

test('complete trailer satisfies the runtime schema including conditional multi-axle dimensions', () => {
	const record = new TrlBuilder().complete().withTrailerId().build();

	expect(isValidObject('v3/tech-record/put/trl/complete/index.json', structuredClone(record), true)).toEqual([]);
});
