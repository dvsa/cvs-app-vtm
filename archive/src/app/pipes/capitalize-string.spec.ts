import { CapitalizeString } from '@app/pipes/capitalize-string';

describe('CapitalizeString', () => {
  const pipe = new CapitalizeString();
  const stringToCapitalize = 'test';

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return capitalized word', () => {
    const res = pipe.transform(stringToCapitalize);
    expect(res).toEqual('Test');
  });

  it('should return empty string if the string to capitalize is empty', () => {
    const res = pipe.transform('');
    expect(res).toEqual('');
  });
});
