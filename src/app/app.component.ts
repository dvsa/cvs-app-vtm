///<reference path="govuk.d.ts">
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user-service/user-service';
import { selectRouteData } from '@store/router/selectors/router.selectors';
import { initAll } from 'govuk-frontend/govuk/all';
import { map, take } from 'rxjs';
import { State } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public userService: UserService, private loadingService: LoadingService, private store: Store<State>) {}

  ngOnInit() {
    initAll();
  }

  get isStandardLayout() {
    return this.store.pipe(
      take(1),
      select(selectRouteData),
      map(routeData => routeData && !routeData['isCustomLayout'])
    );
  }

  get loading() {
    return this.loadingService.showSpinner$;
  }
}
