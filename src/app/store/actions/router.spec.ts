import {
  GO, BACK, FORWARD, Go, Back, Forward,
} from './router';

describe('router', () => {
  test('Go', () => {
    const goParams = { path: [], query: {}, extras: null };
    const action = new Go(goParams);

    expect(action.payload).toBe(goParams);
    expect(action.type).toBe(GO);
  });

  test('Back', () => {
    const action = new Back();

    expect(action.type).toBe(BACK);
  });

  test('Forward', () => {
    const action = new Forward();

    expect(action.type).toBe(FORWARD);
  });
});
