import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { Logout } from '@store/user/user-service.actions';
import { lastValueFrom, skip, of } from 'rxjs';
import { AppModule } from '../../app.module';
import { UserServiceState } from '../../store/user/user-service.reducer';
import { UserService } from './user-service';

describe('User-Service', () => {
  let service: UserService;

  let mockStore: Store<{ userservice: UserServiceState }>;
  let mockBroadcast: MsalBroadcastService;
  let mockMsal: MsalService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [Store, MsalService, MsalBroadcastService]
    });

    mockStore = TestBed.inject(Store);
    mockBroadcast = TestBed.inject(MsalBroadcastService);
    mockMsal = TestBed.inject(MsalService);

    service = new UserService(mockStore, mockBroadcast, mockMsal);
  });

  it('should create the user service', () => {
    expect(service).toBeTruthy();
  });

  it('should get and set the username', (done) => {
    // Skip the default value being set
    service.userName$.pipe(skip(1)).subscribe((data) => {
      expect(data).toBe('you reading this?');
      done();
    });

    service.logIn('you reading this?');
  });

  it('should logout', () => {
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    const MsalSpy = jest.spyOn(mockMsal, 'logout').mockImplementation(() => of());
    service.logOut();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(Logout());
    expect(MsalSpy).toHaveBeenCalledTimes(1);
  });
});
