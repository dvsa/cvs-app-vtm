import { Component } from '@angular/core';
import { Roles } from '@models/roles.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {

  
  public get Roles() {
    return Roles;
  }
}
