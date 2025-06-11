import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { selectQueryParams } from '@store/router/router.selectors';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NoQueryParamsGuard implements CanActivate {
	store = inject(Store);
	router = inject(Router);

	canActivate(): Observable<boolean | UrlTree> {
		return this.store.pipe(
			select(selectQueryParams),
			map((queryParams) => {
				if (!Object.keys(queryParams).length) {
					return this.router.getCurrentNavigation()?.previousNavigation?.finalUrl ?? this.router.parseUrl('');
				}
				return true;
			})
		);
	}
}
