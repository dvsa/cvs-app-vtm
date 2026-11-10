import { TestBed } from '@angular/core/testing';
import { createMockTestResult } from '@mocks/test-result.mock';
import { MultiOptions } from '@models/options.model';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TestStationsService } from '@services/test-stations/test-stations.service';
import { fetchReasonsForAbandoning } from '@store/reference-data';
import { testResultInEdit } from '@store/test-records';
import { fetchTestStations } from '@store/test-stations';
import { Subject, firstValueFrom, of } from 'rxjs';
import { MultiOptionsService, SpecialRefData } from '../multi-options.service';

describe('MultiOptionsService', () => {
	let service: MultiOptionsService;
	let store: MockStore;
	const options: MultiOptions = [{ label: 'Option', value: 'value' }];
	const referenceDataService = {
		getReferenceDataOptions: vi.fn().mockReturnValue(of(options)),
		getReasonsForAbandoning: vi.fn().mockReturnValue(of(options)),
		loadReferenceData: vi.fn(),
	};
	const testStationsService = { getTestStationsOptions: vi.fn().mockReturnValue(of(options)) };

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideMockStore({
					selectors: [{ selector: testResultInEdit, value: createMockTestResult({ vehicleType: VehicleTypes.HGV }) }],
				}),
				{ provide: ReferenceDataService, useValue: referenceDataService },
				{ provide: TestStationsService, useValue: testStationsService },
			],
		});
		store = TestBed.inject(MockStore);
		service = TestBed.inject(MultiOptionsService);
	});

	afterEach(() => {
		store.resetSelectors();
		vi.clearAllMocks();
	});

	it('gets station options from the station service', async () => {
		expect(await firstValueFrom(service.getOptions(SpecialRefData.TEST_STATION_P_NUMBER))).toEqual(options);
		expect(testStationsService.getTestStationsOptions).toHaveBeenCalledOnce();
		expect(referenceDataService.getReferenceDataOptions).not.toHaveBeenCalled();
	});

	it('passes ordinary resources to the reference data service', async () => {
		expect(await firstValueFrom(service.getOptions(ReferenceDataResourceType.CountryOfRegistration))).toEqual(options);
		expect(referenceDataService.getReferenceDataOptions).toHaveBeenCalledExactlyOnceWith(
			ReferenceDataResourceType.CountryOfRegistration
		);
	});

	it('switches abandonment options to the current vehicle and cancels the previous options stream', () => {
		const hgvOptions = new Subject<MultiOptions>();
		const psvOptions = new Subject<MultiOptions>();
		referenceDataService.getReasonsForAbandoning.mockReturnValueOnce(hgvOptions).mockReturnValueOnce(psvOptions);
		const received: (MultiOptions | undefined)[] = [];
		const subscription = service
			.getOptions(SpecialRefData.ReasonsForAbandoning)
			.subscribe((value) => received.push(value));

		hgvOptions.next(options);
		store.overrideSelector(testResultInEdit, createMockTestResult({ vehicleType: VehicleTypes.PSV }));
		store.refreshState();
		hgvOptions.next([{ label: 'Stale HGV reason', value: 'stale' }]);
		const psvReasons = [{ label: 'PSV reason', value: 'psv' }];
		psvOptions.next(psvReasons);
		subscription.unsubscribe();

		expect(referenceDataService.getReasonsForAbandoning.mock.calls).toEqual([[VehicleTypes.HGV], [VehicleTypes.PSV]]);
		expect(received).toEqual([options, psvReasons]);
	});

	it.each([
		[SpecialRefData.TEST_STATION_P_NUMBER, fetchTestStations()],
		[SpecialRefData.ReasonsForAbandoning, fetchReasonsForAbandoning()],
	])('dispatches the load action for %s without loading ordinary reference data', (resource, action) => {
		const dispatch = vi.spyOn(store, 'dispatch');

		service.loadOptions(resource);

		expect(dispatch).toHaveBeenCalledExactlyOnceWith(action);
		expect(referenceDataService.loadReferenceData).not.toHaveBeenCalled();
	});

	it('loads ordinary reference data without dispatching a special action', () => {
		const dispatch = vi.spyOn(store, 'dispatch');

		service.loadOptions(ReferenceDataResourceType.CountryOfRegistration);

		expect(referenceDataService.loadReferenceData).toHaveBeenCalledExactlyOnceWith(
			ReferenceDataResourceType.CountryOfRegistration
		);
		expect(dispatch).not.toHaveBeenCalled();
	});
});
