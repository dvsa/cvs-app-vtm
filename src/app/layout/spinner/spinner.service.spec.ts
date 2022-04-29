import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { lastValueFrom, skip, of } from 'rxjs';
import { AppModule } from '../../app.module';
import { SpinnerService } from './spinner.service';
import { initialAppState, State } from '@store/.';
import * as TechnicalRecordServiceActions from '@store/technical-records/technical-record-service.actions';

describe('Spinner-Service', () => {
  let service: SpinnerService;

  let mockStore: Store<State>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [Store]
    });

    mockStore = TestBed.inject(Store);

    service = new SpinnerService(mockStore);
  });

  it('should create the user service', () => {
    expect(service).toBeTruthy();
  });

  it('should get and set the username', (done) => {
    // Skip the default value being set
    service.showSpinner$.pipe(skip(1)).subscribe((data) => {
      expect(data).toBe(true);
      done();
    });

    mockStore.dispatch(TechnicalRecordServiceActions.getByVIN({vin: 'test'}));
  });
});
