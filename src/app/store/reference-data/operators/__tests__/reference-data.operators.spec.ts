import { ReferenceDataResourceType } from '@models/reference-data.model';
import { of, take } from 'rxjs';
import { handleNotFound, sortReferenceData } from '../reference-data.operators';

describe('Reference data operators', () => {
	describe('handleNotFound.prototype.name', () => {
		it('should emit source observable when there is data', (done) => {
			of({ data: [{ resourceType: 'type', resourceKey: 'key' }] })
				.pipe(take(1), handleNotFound('test'))
				.subscribe({
					next: (val) => {
						expect(val).toEqual({ data: [{ resourceType: 'type', resourceKey: 'key' }] });
						done();
					},
				});
		});
		it('should throw an error if data is empty', (done) => {
			of({ data: [] })
				.pipe(take(1), handleNotFound('test'))
				.subscribe({
					error: (e) => {
						expect(e.message).toBe('Reference data not found for resource type test');
						done();
					},
				});
		});
	});

	describe('sortReferenceData.prototype.name', () => {
		it('should sort strings', (done) => {
			of({
				data: [
					{ resourceType: ReferenceDataResourceType.User, resourceKey: 2, name: 'last name' },
					{ resourceType: ReferenceDataResourceType.User, resourceKey: 3, name: 'some name' },
					{ resourceType: ReferenceDataResourceType.User, resourceKey: 1, name: 'a name' },
				],
			})
				.pipe(take(1), sortReferenceData(ReferenceDataResourceType.User))
				.subscribe({
					next: (val) => {
						expect(val).toEqual({
							data: [
								{ resourceType: ReferenceDataResourceType.User, resourceKey: 1, name: 'a name' },
								{ resourceType: ReferenceDataResourceType.User, resourceKey: 2, name: 'last name' },
								{ resourceType: ReferenceDataResourceType.User, resourceKey: 3, name: 'some name' },
							],
						});
						done();
					},
				});
		});
	});
});
