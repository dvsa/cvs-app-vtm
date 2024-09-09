import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { TestStationsService } from '../test-stations.service';

describe('TestStationsService', () => {
	let service: TestStationsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [TestStationsService, provideMockStore({ initialState: initialAppState })],
		});

		service = TestBed.inject(TestStationsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
