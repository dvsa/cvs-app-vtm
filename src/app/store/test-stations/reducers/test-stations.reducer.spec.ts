import { TestStation } from "@models/test-station.model";
import { fetchTestStation, fetchTestStationFailed, fetchTestStations, fetchTestStationsSuccess, fetchTestStationSuccess } from "../actions/test-stations.actions";
import { initialTestStationsState, testStationsReducer, TestStationsState } from "./test-stations.reducer";

describe('Test Stations Reducer', () => {
  const expectedTestStations = [ { testStationId: 'someId' } as TestStation ];

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };
      const state = testStationsReducer(initialTestStationsState, action);

      expect(state).toBe(initialTestStationsState);
    });
  });

  describe('fetchTestStations', () => {
    it('should set loading to true', () => {
      const newState: TestStationsState = { ...initialTestStationsState, loading: true };
      const action = fetchTestStations();
      const state = testStationsReducer(initialTestStationsState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('fetchTestStationsSuccess', () => {
    it('should set all test result records', () => {
      const newState: TestStationsState = {
        ...initialTestStationsState,
        ids: ['someId'],
        entities: { someId: expectedTestStations[0] }
      };
      const action = fetchTestStationsSuccess({ payload: [...expectedTestStations] });
      const state = testStationsReducer(initialTestStationsState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('fetchTestStationById actions', () => {
    it('should set loading to true', () => {
      const newState: TestStationsState = { ...initialTestStationsState, loading: true };
      const action = fetchTestStation({ id: 'TestStationId0001' });
      const state = testStationsReducer(initialTestStationsState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });

    describe('fetchTestStationsByIdSuccess', () => {
      it('should set all test result records', () => {
        const newState: TestStationsState = {
          ...initialTestStationsState,
          ids: ['someId'],
          entities: { ['someId']: expectedTestStations[0] }
        };
        const action = fetchTestStationSuccess({ id: 'TestStationId0001', payload: expectedTestStations[0] });
        const state = testStationsReducer(initialTestStationsState, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });

    describe('fetchTestStationsByIdFailed', () => {
      it('should set error state', () => {
        const newState = { ...initialTestStationsState, loading: false };
        const action = fetchTestStationFailed({ error: 'unit testing error message' });
        const state = testStationsReducer({ ...initialTestStationsState, loading: true }, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });
  });
});
