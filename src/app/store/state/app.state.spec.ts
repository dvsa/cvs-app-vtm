import { getInitialState, initialAppState } from './app.state';

describe('VehicleTechRecordModel Reducer', () => {
  it('should return the initial state', () => {
    const result = getInitialState();

    expect(result).toBe(initialAppState);
  });
});
