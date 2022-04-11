import { DefaultNullOrEmpty } from "./DefaultNullOrEmpty.pipe";

describe('DefaultNullOrEmpty pipe tests', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new DefaultNullOrEmpty();

  it('transforms null to "-"', () => {
    expect(pipe.transform(null)).toBe('-');
  });

  it('transforms "" to "-"', () => {
    expect(pipe.transform('')).toBe('-');
  });

  it('transforms "     " to "-"', () => {
    expect(pipe.transform('')).toBe('-');
  });

  it('transforms boolean "true" to "Yes"', () => {
    expect(pipe.transform(true)).toBe('Yes');
  });

  it('transforms boolean "false" to "No"', () => {
    expect(pipe.transform(false)).toBe('No');
  });

  it('otherwise returns the string value unchanged', () => {
    expect(pipe.transform('This is OK')).toBe('This is OK');
  });

  it('otherwise returns the date value unchanged', () => {
    const val = new Date();
    expect(pipe.transform(val)).toBe(val);
  });
});
