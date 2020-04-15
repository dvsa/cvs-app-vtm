import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen, switchMap } from 'rxjs/operators';

const getErrorMessage = { error: `Unable to load data. Please contact the help desk or refresh the page to try again.` };

const defaultMaxRetry = 3;
const defaultDelay = 3000;

export function delayedRetry(): ((param: Observable<any>) => Observable<any>) {
  let retries = defaultMaxRetry;

  return (source: Observable<any>) => source.pipe(
    retryWhen((errors: Observable<any>) => errors.pipe(
      switchMap((res: any) => {
        if (res.status < 500 && res.status !== 0) {
          return throwError(res);
        } else {
          return of(res);
        }
      }),
      delay(defaultDelay),
      mergeMap(error => retries-- > 0 ? of(error) : throwError(getErrorMessage))
    ))
  );
}
