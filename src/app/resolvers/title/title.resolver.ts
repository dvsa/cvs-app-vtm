import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Resolve } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { selectRouteData } from '@store/router/selectors/router.selectors';

@Injectable({
  providedIn: 'root',
})
export class TitleResolver implements Resolve<boolean> {
  constructor(private titleService: Title, private store: Store<State>) {}
  resolve(): Promise<boolean> {
    return new Promise((resolve) => {
      this.store.pipe(select(selectRouteData)).subscribe((navigationData) => {
        const { title } = navigationData;
        if (title) {
          this.titleService.setTitle(`Vehicle Testing Management - ${title as string}`);
        }
      });
      resolve(true);
    });
  }
}
