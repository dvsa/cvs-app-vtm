import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { UserService } from './../app-user.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private adal: MsAdalAngular6Service, private userSvc: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const resource = this.adal.GetResourceForEndpoint(req.url);
    if (!resource) {
      return next.handle(req);
    }

    if (!this.adal.isAuthenticated) {
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
      headers: req.headers.set('Authorization', `Bearer ${this.adal.accessToken}`)
    });

    this.userSvc.setUser(this.adal.userInfo.profile);
    return next.handle(authorizedAdalRequest);
  }
}
