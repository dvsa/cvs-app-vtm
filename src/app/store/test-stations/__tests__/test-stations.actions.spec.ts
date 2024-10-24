import {
	fetchTestStation,
	fetchTestStationFailed,
	fetchTestStationSuccess,
	fetchTestStations,
	fetchTestStationsFailed,
	fetchTestStationsSuccess,
} from '../test-stations.actions';

describe('Test Stations Actions', () => {
	it('should return correct types', () => {
		expect(fetchTestStations.type).toBe('[API/test-stations] Fetch Test Stations');
		expect(fetchTestStationsSuccess.type).toBe('[API/test-stations] Fetch Test Stations Success');
		expect(fetchTestStationsFailed.type).toBe('[API/test-stations] Fetch Test Stations Failed');
		expect(fetchTestStation.type).toBe('[API/test-stations] Fetch Test Station by ID');
		expect(fetchTestStationSuccess.type).toBe('[API/test-stations] Fetch Test Station by ID Success');
		expect(fetchTestStationFailed.type).toBe('[API/test-stations] Fetch Test Station by ID Failed');
	});
});
