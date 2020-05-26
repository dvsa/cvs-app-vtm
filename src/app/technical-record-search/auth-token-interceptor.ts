import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { UserService } from './../app-user.service';
import { AdalAuthService } from '@app/adal-auth.service';
import { Store } from '@ngrx/store';
import { SetUserSuccess } from '@app/store/actions/User.action';
import { UserState } from '@app/store/reducers/User.reducers';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(
    private adal: AdalAuthService,
    private userSvc: UserService,
    private store: Store<UserState>,
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const resource = this.adal.getResourceForEndpoint(req.url);
    if (!resource) {
      return next.handle(req);
    }

    if (!this.adal.isAuthenticated()) {
      return this.adal.acquireToken(resource).pipe(
        mergeMap((token: string) => {
          const authorizedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(authorizedRequest);
        })
      );
    }

    const authorizedAdalRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.adal.accessToken()}`)
    });
 
    // TODO: Remove once data is retrieved from store with selector
    this.userSvc.setUser(this.adal.getProfile());
    // TODO: Implement once auth guard is in place, we don't want to dispatch this action
    // every time we fetch data...
    // SetUserSuccess is an effect so we dispatch setUser first
    const { oid: msOid, unique_name: msUser} = this.adal.getProfile();
    this.store.dispatch(new SetUserSuccess({msUser, msOid}));

    return next.handle(authorizedAdalRequest);
  }
}
