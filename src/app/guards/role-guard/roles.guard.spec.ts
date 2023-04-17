import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/.';
import { of, lastValueFrom } from 'rxjs';
import { RoleGuard } from './roles.guard';
import { InteractionStatus } from '@azure/msal-browser';

describe('RoleGuard', () => {
  let guard: RoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RoleGuard,
        provideMockStore({ initialState: initialAppState }),
        { provide: UserService, useValue: { roles$: of(['CVSFullAccess']), inProgress$: of(InteractionStatus.None) } }
      ]
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when I give it the correct role', async () => {
    const next = new ActivatedRouteSnapshot();
    next.data = { roles: ['CVSFullAccess'] };

    const guardObservable = guard.canActivate(next);

    await expect(lastValueFrom(guardObservable)).resolves.toEqual(true);
  });

  it('should return false when I give it the incorrect role', async () => {
    const next = new ActivatedRouteSnapshot();
    next.data = { roles: ['BadRole'] };

    const guardObservable = guard.canActivate(next);

    await expect(lastValueFrom(guardObservable)).resolves.toEqual(false);
  });

  it('should return true when I give it one incorrect role and one correct role', async () => {
    const next = new ActivatedRouteSnapshot();
    next.data = { roles: ['CVSFullAccess', 'BadRole'] };

    const guardObservable = guard.canActivate(next);

    await expect(lastValueFrom(guardObservable)).resolves.toEqual(true);
  });
});
