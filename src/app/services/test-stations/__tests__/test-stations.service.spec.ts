import { TestBed } from '@angular/core/testing';
import { TestStationSchema } from '@dvsa/cvs-type-definitions/types/v1/test-station';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { testStations } from '@store/test-stations';
import { firstValueFrom } from 'rxjs';
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

	it('formats options in name order without mutating the store selection', async () => {
		const station: TestStationSchema = {
			testStationId: 'station-id',
			testStationName: 'Zulu station',
			testStationPNumber: 'P002',
			testStationContactNumber: '',
			testStationAccessNotes: '',
			testStationGeneralNotes: '',
			testStationTown: '',
			testStationAddress: '',
			testStationPostcode: '',
			testStationLongitude: 0,
			testStationLatitude: 0,
			testStationType: 'atf',
			testStationEmails: [],
			testStationStatus: 'open',
		};
		const stations: TestStationSchema[] = [
			station,
			{ ...station, testStationId: 'other-station', testStationName: 'Alpha station', testStationPNumber: 'P001' },
		];
		const original = structuredClone(stations);
		Object.freeze(stations);
		TestBed.inject(MockStore).overrideSelector(testStations, stations);

		expect(await firstValueFrom(service.getTestStationsOptions())).toEqual([
			{ value: 'P001', label: 'Alpha station - P001' },
			{ value: 'P002', label: 'Zulu station - P002' },
		]);
		expect(stations).toEqual(original);
	});

	it('returns no options when no stations have been loaded', async () => {
		TestBed.inject(MockStore).overrideSelector(testStations, []);

		expect(await firstValueFrom(service.getTestStationsOptions())).toEqual([]);
	});
});
