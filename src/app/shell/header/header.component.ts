import { Component, OnInit } from '@angular/core';
import {MsAdalAngular6Service} from 'microsoft-adal-angular6';

@Component({
  selector: 'vtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string;
  menuOpen = false;
  constructor(private adal: MsAdalAngular6Service) {
  }

  ngOnInit() {
    this.userName = this.adal.userInfo != null ? this.adal.userInfo.profile.name : '';
  }

  onClick($event) {
    this.menuOpen = !this.menuOpen;
  }

  logOut() {
    if (this.adal.isAuthenticated) {
      this.adal.logout();
    } else {
      return false;
    }
  }
}
