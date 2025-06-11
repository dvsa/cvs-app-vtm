import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { routeEditable } from '@store/router/router.selectors';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NoEditGuard implements CanActivate {
	store = inject(Store);
	router = inject(Router);

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
