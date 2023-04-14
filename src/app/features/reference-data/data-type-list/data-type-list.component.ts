import { Component } from '@angular/core';
import { Roles } from '@models/roles.enum';

@Component({
  selector: 'app-data-type-list',
  templateUrl: './data-type-list.component.html'
})
export class DataTypeListComponent {
  public get roles() {
    return Roles;
  }
}
