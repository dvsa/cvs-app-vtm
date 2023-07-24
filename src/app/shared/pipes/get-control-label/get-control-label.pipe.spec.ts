import { GetControlLabelPipe } from './get-control-label.pipe';
import { FormNodeOption } from '@forms/services/dynamic-form.types';

describe('GetControlLabelPipe', () => {
  let testOptions: FormNodeOption<string>[];

  beforeEach(() => {
    testOptions = [
      { label: 'Test', value: 'test' },
      { label: 'Foo', value: 'bar' }
    ];
  });

  it('create an instance', () => {
    const pipe = new GetControlLabelPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the label if one is available', () => {
    const pipe = new GetControlLabelPipe();
    expect(pipe.transform('test', testOptions)).toBe('Test');
  });

  it('should return the value if no label is available', () => {
    const pipe = new GetControlLabelPipe();
    expect(pipe.transform('foo', testOptions)).toBe('foo');
  });
});
