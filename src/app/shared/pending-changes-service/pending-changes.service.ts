import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { PreventLeavePageModalComponent } from '../prevent-page-leave-modal/prevent-leave-page-modal.component';

@Injectable({
  providedIn: 'root'
})
export class PendingChangesService {

  constructor(private dialog: MatDialog, private router: Router) {
  }

  confirm(): Observable<boolean> {
    const destinationLink = window.location.href;
    setTimeout(() => {
      window.history.replaceState({}, '', destinationLink);
      window.history.pushState({}, '', this.router.url);
    });
    const dialogRef = this.dialog.open(PreventLeavePageModalComponent, {
      width: '600px',
    });

    return dialogRef.afterClosed().pipe(
      switchMap((res) => res ? of(true) : of(false)),
      catchError((err) => of(false))
    );
  }
}
