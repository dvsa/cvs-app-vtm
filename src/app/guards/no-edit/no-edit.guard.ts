import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '@store/.';
import { routeEditable } from '@store/router/selectors/router.selectors';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NoEditGuard implements CanActivate {
	constructor(
		private store: Store<State>,
		private router: Router
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
		return this.store.pipe(
			select(routeEditable),
			map((editable) => {
				if (!editable) {
					return true;
				}

				const tree = this.router.parseUrl(state.url);
				delete tree.queryParams['edit'];

				return tree;
			})
		);
	}
}
