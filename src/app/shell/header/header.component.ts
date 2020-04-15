import { Component, OnInit } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { LogoutModalComponent } from './logout-modal/logout-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'vtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string;
  menuOpen = false;

  constructor(
    private adal: MsAdalAngular6Service,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.userName = this.adal.userInfo != null ? this.adal.userInfo.profile.name : '';
  }

  onClick($event) {
    this.menuOpen = !this.menuOpen;
  }

  logOut() {
    if (this.adal.isAuthenticated) {
      const dialogRef = this.dialog.open(LogoutModalComponent, {
        width: '600px',
        disableClose: true
      });
      return dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.adal.logout();
        }
      });
    } else {
      return false;
    }
  }
}
