import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { map, mergeMap } from 'rxjs/operators';
import { getByVIN, getByVINSuccess } from './technical-record-service.actions';

@Injectable()
export class TechnicalRecordServiceEffects {
  getByVin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVIN),
      mergeMap(
        (action) => this.technicalRecordService.getByVIN(action.vin).pipe(map((vehicleTechRecords) => getByVINSuccess({ vehicleTechRecords })))
        // catchError(() => getByVINFailure('There was a problem getting the Tech Record by VIN'))
      )
    )
  );

  // example from: https://github.com/ngrx/platform/blob/a3fdfb47fc177c49a461a1613c11df4040dfcc49/projects/example-app/src/app/books/effects/book.effects.ts
  // search$ = createEffect(
  //   () => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
  //     this.actions$.pipe(
  //       ofType(FindBookPageActions.searchBooks),
  //       debounceTime(debounce, scheduler),
  //       switchMap(({ query }) => {
  //         if (query === '') {
  //           return empty;
  //         }

  //         const nextSearch$ = this.actions$.pipe(
  //           ofType(FindBookPageActions.searchBooks),
  //           skip(1)
  //         );

  //         return this.googleBooks.searchBooks(query).pipe(
  //           takeUntil(nextSearch$),
  //           map((books: Book[]) => BooksApiActions.searchSuccess({ books })),
  //           catchError((err) =>
  //             of(BooksApiActions.searchFailure({ errorMsg: err.message }))
  //           )
  //         );
  //       })
  //     )
  // );

  constructor(private actions$: Actions, private technicalRecordService: TechnicalRecordService) {}
}
