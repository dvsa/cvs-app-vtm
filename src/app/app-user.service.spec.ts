import { TestBed } from '@angular/core/testing';

import { UserService } from './app-user.service';
import { UserDetails } from './models/user-details';

describe('Service: AppUser', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });

    service = TestBed.get(UserService);
  });

  it('should get user details', () => {
    const profile = {
      oid: 'some-oid',
      unique_name: 'user-name'
    };
    service.setUser(profile);

    const userDetails = service.getUser();

    expect(userDetails).toEqual({
      msOid: 'some-oid',
      msUser: 'user-name'
    } as UserDetails);
  });
});
