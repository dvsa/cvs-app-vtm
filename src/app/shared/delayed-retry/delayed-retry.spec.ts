import { from, throwError } from 'rxjs';
import { delayedRetry } from './delayed-retry';

export const errorSource = from([throwError('test'), throwError('test')]);

describe('delayedRetry', () => {
  test('it should create', async (done) => {
    errorSource.subscribe((res) => {
      const test = delayedRetry();
      expect(test).toBeTruthy();
      done();
    });
  });
});
