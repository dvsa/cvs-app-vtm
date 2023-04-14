import { Component, OnInit } from '@angular/core';
import { Roles } from '@models/roles.enum';

@Component({
  selector: 'app-data-type-list',
  templateUrl: './data-type-list.component.html'
})
export class DataTypeListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public get roles() {
    return Roles;
  }
}
