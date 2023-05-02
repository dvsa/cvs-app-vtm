import { RouterReducerState, SerializedRouterStateSnapshot } from '@ngrx/router-store';
import { selectRouteNestedParams } from './router.selectors';

describe('selectRouteNestedParams', () => {
  it('should return all nested params as a flat object', () => {
    const router = {
      state: { root: { firstChild: { params: { foo: 'bar' }, firstChild: { params: { bar: 'baz' } } } } }
    } as unknown as RouterReducerState<SerializedRouterStateSnapshot>;
    const params = selectRouteNestedParams.projector(router);
    expect(params).toEqual({ foo: 'bar', bar: 'baz' });
  });
});
