///<reference path="govuk.d.ts">
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from '@services/user-service/user-service';
import { fetchTestTypes } from '@store/test-types/actions/test-types.actions';
import { initAll } from 'govuk-frontend/govuk/all';
import { State } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(public userService: UserService, private store: Store<State>) {}

  ngOnInit() {
    initAll();
    this.store.dispatch(fetchTestTypes());
  }
}
