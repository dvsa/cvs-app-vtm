import { DisplayByDelimiter } from '@app/pipes/display-by-delimiter';

describe('DisplayByDelimiter', () => {
  const pipe = new DisplayByDelimiter();
  const stringsToConcatenate: string[] = ['test1', 'test2'];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return strings concatenated with given delimiter', () => {
    const stringsConcatenated = 'test1/test2';
    const res = pipe.transform(stringsToConcatenate, '/');
    expect(res).toEqual(stringsConcatenated);
  });

  it('should return strings concatenated with no delimiter', () => {
    const stringsConcatenated = 'test1test2';
    const res = pipe.transform(stringsToConcatenate, '');
    expect(res).toEqual(stringsConcatenated);
  });

  it('should not concatenate if empty string is given', () => {
    const stringsConcatenated = '';
    const res = pipe.transform([''], '');
    expect(res).toEqual(stringsConcatenated);
  });
});
