import { Injectable } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
// import { MsAdalAngular6Module } from 'microsoft-adal-angular6';


@Injectable({
  providedIn: 'root'
})
export class AdalAuthService {

  constructor(
    private msAdal: MsAdalAngular6Service
  ) { }

  isAuthenticated() {
    return this.msAdal.isAuthenticated
  }

  getProfile() {
    return this.msAdal.userInfo.profile
  }

  getResourceForEndpoint(url) {
    return this.msAdal.GetResourceForEndpoint(url)
  }

  acquireToken(resource) {
    return this.msAdal.acquireToken(resource)
  }

  accessToken() {
    return this.msAdal.accessToken
  }
}
