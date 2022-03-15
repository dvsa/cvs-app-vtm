import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() usernameObservable!: Observable<string>;
  @Output() logOutEvent = new EventEmitter<void>();
  username = "";

  ngOnInit(): void {
    this.usernameObservable.subscribe((value: string) => { this.username = value; });
  }

  logout() {
    this.logOutEvent.emit();
  }
}
