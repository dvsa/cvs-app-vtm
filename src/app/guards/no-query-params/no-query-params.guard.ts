import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '@store/.';
import { selectQueryParams } from '@store/router/selectors/router.selectors';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NoQueryParamsGuard implements CanActivate {
	constructor(
		private store: Store<State>,
		private router: Router
	) {}
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
