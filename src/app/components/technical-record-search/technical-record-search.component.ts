import {Component} from '@angular/core';
import {GetVehicleTechRecordModelHavingStatusAll} from '../../store/actions/VehicleTechRecordModel.actions';
import {Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {TechRecordModel} from '../../models/tech-record.model';
import { Observable } from 'rxjs';
import { selectSearchPageError } from '@app/store/selectors/searchPage.selectors';

@Component({
  selector: 'app-technical-record-search',
  templateUrl: './technical-record-search.component.html',
  styleUrls: ['./technical-record-search.component.scss']
})
export class TechnicalRecordSearchComponent {

  searchIdentifier = '{none searched}';
  isLoading: boolean;
  techRecords: TechRecordModel[];
  searchError$: Observable<any>;

  constructor(private _store: Store<IAppState>) {
    this.searchError$ = this._store.select( s => s.vehicleTechRecordModel.error);
    //this.searchError$.subscribe( s => console.log(`searchError$ => ${JSON.stringify(s)}`));
  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAll(q));
  }

}
