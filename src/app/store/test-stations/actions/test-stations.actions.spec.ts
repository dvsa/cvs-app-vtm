import { fetchTestStation, fetchTestStationFailed, fetchTestStations, fetchTestStationsFailed, fetchTestStationsSuccess, fetchTestStationSuccess } from "./test-stations.actions";

describe('Test Result Actions', () => {
  it('should return correct types', () => {
    expect(fetchTestStations.type).toBe('[API/test-stations] Fetch All Test Stations');
    expect(fetchTestStationsSuccess.type).toBe('[API/test-stations] Fetch All Test Stations Success');
    expect(fetchTestStationsFailed.type).toBe('[API/test-stations] Fetch All Test Stations Failed');
    expect(fetchTestStation.type).toBe('[API/test-stations] Fetch All Test Station by ID');
    expect(fetchTestStationSuccess.type).toBe('[API/test-stations] Fetch All Test Station by ID Success');
    expect(fetchTestStationFailed.type).toBe('[API/test-stations] Fetch All Test Station by ID Failed');
  });
});
