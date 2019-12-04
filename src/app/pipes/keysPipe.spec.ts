import {KeysPipe} from './keysPipe';

describe('KeysPipe', () => {
  const pipe = new KeysPipe();
  it('should return only the provided keys', () => {
    const expectedRes = [{
      key: 'key1',
      value: 1,
    },
      {
        key: 'key2',
        value: 2,
      }];
    const res = pipe.transform({key1: 1, key2: 2});
    expect(res).toEqual(expectedRes);
  });
});
