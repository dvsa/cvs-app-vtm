import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  ngOnInit(): void {
  }

  @Input() username = '';

  @Output() logOut = new EventEmitter<string>();

  logout() {
    this.logOut.emit();
  }

}
