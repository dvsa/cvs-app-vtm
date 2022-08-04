import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { formatData } from '@store/test-types/selectors/test-types.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor() {}
}
