import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Action } from '@ngrx/store';
import { getErrors } from '@app/store/selectors/error.selectors';

export default class MockStore {
  mockSelector: BehaviorSubject<any>;

  constructor(mockSelector) {
    this.mockSelector = mockSelector;
  }

  select(selector: any) {
    switch (selector) {
      case getErrors:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getErrors') ? value['getErrors'] : []
          )
        );
      default:
        return this.mockSelector;
    }
  }

  dispatch(action: Action) {
    return [];
  }
}
