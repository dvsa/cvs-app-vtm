import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { PendingChangesService } from './pending-changes.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';


describe('PendingChangesService', () => {
  let dialog: MatDialog;
  let injector: TestBed;
  let service: PendingChangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule],
      providers: [PendingChangesService]
    }).compileComponents();

    injector = getTestBed();
    service = injector.get(PendingChangesService);
    dialog = injector.get(MatDialog);
  });

  it('should be created', inject([PendingChangesService], (pendingChangesService: PendingChangesService) => {
    expect(pendingChangesService).toBeTruthy();
  }));

  describe('confirm', () => {
    test('should open modal and return observable of true result when confirm', (done) => {
      spyOn(window, 'setTimeout');
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });

      service.confirm().subscribe(res => {
        expect(dialog.open).toHaveBeenCalled();
        expect(res).toEqual(true);
        done();
      });
    });

    test('should open modal and return observable of false result when user declines', (done) => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) });

      service.confirm().subscribe(res => {
        expect(dialog.open).toHaveBeenCalled();
        expect(res).toEqual(false);
        done();
      });
    });

    test('should open modal and return observable of false result when it throws error', (done) => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => throwError(false) });

      service.confirm().subscribe(res => {
        expect(dialog.open).toHaveBeenCalled();
        expect(res).toEqual(false);
        done();
      });
    });
  });
});
