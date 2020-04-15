import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { PendingChangesService } from '../pending-changes-service/pending-changes.service';
import { PendingChangesGuard } from './pending-changes.guard';


describe('PendingChangesGuard', () => {
  let injector: TestBed;
  let guard: PendingChangesGuard;
  let service: PendingChangesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PendingChangesGuard,
        {
          provide: PendingChangesService,
          useValue: {
            confirm: () => false
          }
        }]
    }).compileComponents();

    injector = getTestBed();
    guard = injector.get(PendingChangesGuard);
    service = injector.get(PendingChangesService);
  });

  it('should return true when user is allowed to navigate', inject([PendingChangesGuard], (pendingChangesGuard: PendingChangesGuard) => {
    expect(pendingChangesGuard).toBeTruthy();
  }));

  describe('canDeactivate', () => {
    test('should retrurn true if the component can be deactivated', () => {
      expect(guard.canDeactivate({canDeactivate: () => true })).toBe(true);
    });

    test('should retrurn service call if the component can not be deactivated', () => {
      expect(guard.canDeactivate({canDeactivate: () => false })).toBe(service.confirm());
    });
  });
});
