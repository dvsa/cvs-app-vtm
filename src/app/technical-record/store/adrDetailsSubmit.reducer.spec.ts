import {AdrDetailsSubmitReducer} from '@app/technical-record/store/adrDetailsSubmit.reducer';
import {SubmitAdrAction, SubmitAdrActionFailure} from './adrDetailsSubmit.actions';
import {initialAdrDetailsSubmitState} from '@app/technical-record/store/adrDetailsSubmit.state';

describe('AdrDetailsSubmitReducer', () => {

  it('should return the default state', () => {
    const action = {type: ''} as any;
    const result = AdrDetailsSubmitReducer(undefined, action);

    expect(result).toEqual( {'adrDetailsPayload': null, 'context': null, 'error': null} );
  });

  it('should handle submit action', () => {
    const submitAdrAction = new SubmitAdrAction(null);
    const result = AdrDetailsSubmitReducer(initialAdrDetailsSubmitState, submitAdrAction);

    expect(result).toEqual(initialAdrDetailsSubmitState);
  });

  it('should handle submit action failure', () => {
    const submitAdrActionFailure = new SubmitAdrActionFailure(null);
    const result = AdrDetailsSubmitReducer(initialAdrDetailsSubmitState, submitAdrActionFailure);

    expect(result).toEqual(initialAdrDetailsSubmitState);
  });

});
