import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { Logout } from '@store/user/user-service.actions';
import jwtDecode from 'jwt-decode';
import { of, take } from 'rxjs';
import { AppModule } from '../../app.module';
import { UserServiceState } from '../../store/user/user-service.reducer';
import { UserService } from './user-service';

jest.mock('jwt-decode', () => jest.fn());

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

  describe('User getters', () => {
    const user = { name: 'name', username: 'name@mail.com', oid: '123', accessToken: '12345' };

    beforeEach(() => {
      (jwtDecode as jest.Mock).mockImplementationOnce(() => ({ roles: ['12345'] }));
      service.logIn(user);
    });

    it('should get the username', done => {
      service.userName$.pipe(take(1)).subscribe(data => {
        expect(data).toEqual(user.username);
        done();
      });
    });

    it('should get the name', done => {
      service.name$.pipe(take(1)).subscribe(data => {
        expect(data).toEqual(user.name);
        done();
      });
    });

    it('should get the id', done => {
      service.id$.pipe(take(1)).subscribe(data => {
        expect(data).toEqual(user.oid);
        done();
      });
    });

    it('should get the roles', done => {
      service.roles$.pipe(take(1)).subscribe(data => {
        expect(data).toEqual([user.accessToken]);
        done();
      });
    });
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
