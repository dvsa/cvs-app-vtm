import {CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {Observable, of} from 'rxjs';

export class AuthenticationGuardMock  {
  private adalConfig;
  private context;
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

  acquireToken(url: string): Observable<any> {
    return of({token: '342304932049234'});
  }

  getToken(url: string): string {
    return 'token';
  }

  handleCallback(): void {
    return;
  }

}
