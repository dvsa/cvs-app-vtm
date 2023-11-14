import { DigitGroupSeparatorPipe } from './digit-group-separator.pipe';

describe('digitGroupSeparator pipe tests', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new DigitGroupSeparatorPipe();

  it('returns undefined', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('does not separate number', () => {
    expect(pipe.transform(10)).toBe('10');
  });

  it('transforms 1000 to "1,000"', () => {
    expect(pipe.transform(1000)).toBe('1,000');
  });

  it('transforms 1000000 to "1,000,000"', () => {
    expect(pipe.transform(1000000)).toBe('1,000,000');
  });
});
