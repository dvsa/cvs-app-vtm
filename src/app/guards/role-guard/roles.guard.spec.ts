import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InteractionStatus } from '@azure/msal-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/.';
import { lastValueFrom, of } from 'rxjs';
import { RoleGuard } from './roles.guard';

describe('RoleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        { provide: UserService, useValue: { roles$: of(['CVSFullAccess']), inProgress$: of(InteractionStatus.None) } },
      ],
    });
  });

  it('should return true when I give it the correct role', async () => {
    const next = new ActivatedRouteSnapshot();
    next.data = { roles: ['CVSFullAccess'] };

    await TestBed.runInInjectionContext(async () => {
      await expect(lastValueFrom(RoleGuard(next))).resolves.toBe(true);
    });
  });

  it('should return false when I give it the incorrect role', async () => {
    const next = new ActivatedRouteSnapshot();
    next.data = { roles: ['BadRole'] };

    await TestBed.runInInjectionContext(async () => {
      await expect(lastValueFrom(RoleGuard(next))).resolves.toBe(false);
    });
  });

  it('should return true when I give it one incorrect role and one correct role', async () => {
    const next = new ActivatedRouteSnapshot();
    next.data = { roles: ['CVSFullAccess', 'BadRole'] };

    await TestBed.runInInjectionContext(async () => {
      await expect(lastValueFrom(RoleGuard(next))).resolves.toBe(true);
    });
  });
});
