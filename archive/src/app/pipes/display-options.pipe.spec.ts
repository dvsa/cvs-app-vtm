import { DisplayOptionsPipe } from './display-options.pipe';

describe('Pipe: DisplayOptions', () => {
  let pipe: DisplayOptionsPipe;

  beforeEach(() => {
    pipe = new DisplayOptionsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the expected object given the array of string values', () => {
    const strOptions = ['AT', 'DANGER', 'NON-DANGER'];
    const selectedOptions = ['AT', 'DANGER'];
    const result = pipe.transform(strOptions, selectedOptions);
    expect(result).toStrictEqual([
      { id: 0, name: 'AT', selected: true },
      { id: 1, name: 'DANGER', selected: true },
      { id: 2, name: 'NON-DANGER', selected: false }
    ]);
  });
});
