import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CancelEditTechGuard } from './cancel-edit-tech.guard';

describe('CancelEditTechGuard', () => {
  let guard: CancelEditTechGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        CancelEditTechGuard,
        provideMockStore({}),
        { provide: RouterStateSnapshot, useValue: jest.fn().mockReturnValue({ url: '', toString: jest.fn() }) },
      ],
    });
    guard = TestBed.inject(CancelEditTechGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true', () => {
    expect(guard.canDeactivate()).toBeTruthy();
  });
});
