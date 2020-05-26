import { Injectable } from '@angular/core';

import { UserDetails } from './models/user-details';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user: UserDetails;

  constructor() {}

  setUser(userProfile) {
    this.user = {} as UserDetails;
    this.user.msOid = userProfile.oid;
    this.user.msUser = userProfile.unique_name;
  }

  // TODO: Refactor, remove when auth class is implemented,
  // user retrieved from the store user.details
  getUser() {
    return this.user;
  }

}
