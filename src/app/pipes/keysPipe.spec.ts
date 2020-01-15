import {KeysPipe} from '@app/pipes/keysPipe';

describe('keysPipe', () => {
  const pipe = new KeysPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

});
