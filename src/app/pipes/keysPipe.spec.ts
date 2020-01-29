import {KeysPipe} from '@app/pipes/keysPipe';

describe('keysPipe', () => {
  const pipe = new KeysPipe();
  const values = [
    { ['abcde'] : '1234' }
  ];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should do something', () => {
    const keys = pipe.transform(values);
    const result = [ {'key': '0', 'value': {'abcde': '1234'} } ];
    expect(keys).toBeDefined();
    expect(keys).toEqual(result);
  });


});
