import {Observable, of} from 'rxjs';

export class AuthenticationGuardMock  {
  readonly LoggedInUserEmail: string;
  readonly LoggedInUserName: any;
  readonly userInfo: adal.User;
  readonly accessToken: string;
  readonly isAuthenticated: boolean;

  login() {
    return;
  }

  logout() {
    return;
  }

  GetResourceForEndpoint() {
    return 'mock';
  }

  RenewToken() {
    return;
  }

  acquireToken(): Observable<any> {
    return of({token: '342304932049234'});
  }

  getToken(): string {
    return 'token';
  }

  handleCallback(): void {
    return;
  }

}
