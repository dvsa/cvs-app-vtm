import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() logOutEvent = new EventEmitter<void>();
  @Input() username: string | null = "";

  logout() {
    this.logOutEvent.emit();
  }
}
