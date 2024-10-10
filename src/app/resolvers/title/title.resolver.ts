import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveFn } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '@store/.';
import { selectRouteData } from '@store/router/router.selectors';

export const titleResolver: ResolveFn<boolean> = () => {
	const store: Store<State> = inject(Store<State>);
	const titleService: Title = inject(Title);
	return new Promise((resolve) => {
		store.pipe(select(selectRouteData)).subscribe((navigationData) => {
			const { title } = navigationData;
			if (title) {
				titleService.setTitle(`Vehicle Testing Management - ${title as string}`);
			}
		});
		resolve(true);
	});
};
