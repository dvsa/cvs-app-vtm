import {DefaultNullOrEmpty} from './DefaultNullOrEmptyPipe';

describe('DefaultNullOrEmptyPipe', () => {

  const pipe = new DefaultNullOrEmpty();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return Yes if value is boolean', () => {
    const expectedRes = 'YES';
    const res = pipe.transform(true);
    expect(res).toEqual(expectedRes);
  });

  it('should return No if value is false', () => {
    const expectedRes = 'NO';
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

  it('should return date formatted string if value is a date string', () => {
    const expectedRes = '14/02/2019';
    const res = pipe.transform('2019-02-14T10:36:33.987Z');
    expect(res).toEqual(expectedRes);
  });

  it('should return value as default for type number', () => {
    const expectedRes = 3;
    const res = pipe.transform(3);
    expect(res).not.toBeNull();
    expect(res).toEqual(expectedRes);
  });

  it('should check if date formatted string is same as value', () => {
    const checkDate = new Date('2019-02-14T10:36:33.987Z');
    const stringToCheck = '2019-02-14T10:36:33.987Z';
    const res = pipe.transform(stringToCheck);
    expect(checkDate.toISOString()).toEqual(stringToCheck);
    expect(res).toEqual('14/02/2019');
  });

  it('a string of 2020-06-24 should be displayed in proper format', () => {
    const stringToCheck = '2020-06-24';
    const res = pipe.transform(stringToCheck);
    expect(res).toEqual('24/06/2020');
  });

});
