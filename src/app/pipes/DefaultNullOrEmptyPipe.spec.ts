import { DefaultNullOrEmpty } from './DefaultNullOrEmptyPipe';

describe('DefaultNullOrEmptyPipe', () => {
  const pipe = new DefaultNullOrEmpty();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return Yes if value is boolean', () => {
    const expectedRes = 'Yes';
    const res = pipe.transform(true);
    expect(res).toEqual(expectedRes);
  });

  it('should return No if value is false', () => {
    const expectedRes = 'No';
    const res = pipe.transform(false);
    expect(res).toEqual(expectedRes);
  });

  it('should return - if value is null', () => {
    const expectedRes = '-';
    const res = pipe.transform(null);
    expect(res).toEqual(expectedRes);
  });

  it('should return - if value is empty string', () => {
    const expectedRes = '-';
    const res = pipe.transform('');
    expect(res).toEqual(expectedRes);
  });

  it('should return value as default for type number', () => {
    const expectedRes = 3;
    const res = pipe.transform(3);
    expect(res).not.toBeNull();
    expect(res).toEqual(expectedRes);
  });

  it('a string of 2020-06-24 should be displayed in proper format', () => {
    const stringToCheck = '24/06/2020';
    const res = pipe.transform(stringToCheck);
    expect(res).toEqual('24/06/2020');
  });
});
