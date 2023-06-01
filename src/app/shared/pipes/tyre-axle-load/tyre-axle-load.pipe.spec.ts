import { ReferenceDataResourceType } from '@models/reference-data.model';
import { TyreAxleLoadPipe } from './tyre-axle-load.pipe';

describe('TyreAxleLoadPipe', () => {
  it('create an instance', () => {
    const pipe = new TyreAxleLoadPipe();
    expect(pipe).toBeTruthy();
  });

  describe('transform the values', () => {
    const pipe = new TyreAxleLoadPipe();

    it('should return the value of the axle load if it is defined', () => {
      expect(pipe.transform('value', '123', 2, [])).toBe('value');
    });

    it('should multiply the value by the given factor and return the value as a string', () => {
      expect(
        pipe.transform(undefined, '123', 2, [{ resourceType: ReferenceDataResourceType.TyreLoadIndex, resourceKey: '123', load_index: '200' }])
      ).toBe((200 * 2).toString());
    });

    it('should return undefined if the loadIndex is undefined and the value is undefined', () => {
      expect(pipe.transform(undefined, undefined, 3, [])).toBeUndefined();
    });
  });
});
