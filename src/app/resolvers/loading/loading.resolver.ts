import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectIsLoading } from '../../store/loading/loading.selectors';

export const loadingResolver: ResolveFn<boolean> = () => {
	const store = inject(Store);
	return store.select(selectIsLoading).pipe(map((loading) => !loading));
};
