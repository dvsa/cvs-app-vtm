import { DisplayByDelimiter } from '@app/pipes/display-by-delimiter';

describe('DisplayByDelimiter', () => {
  const pipe = new DisplayByDelimiter();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return Yes if value is boolean', () => {
    const stringsConcatenated = 'test1/test2';
    const res = pipe.transform(['test1', 'test2'], '/');
    expect(res).toEqual(stringsConcatenated);
  });

});
