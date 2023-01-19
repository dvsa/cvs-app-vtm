import { Component, OnInit } from '@angular/core';
import { MultiOptions } from '@forms/models/options.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {
  constructor() {}
  get vehicleTypeOptions(): MultiOptions {
    return [
      { label: 'Heavy goods vehicle (HGV)', value: 'hgv' },
      { label: 'Light goods vehicle (LGV)', value: 'lgv' },
      { label: 'Public service vehicle (PSV)', value: 'psv' },
      { label: 'Trailer (TLR)', value: 'tlr' }
    ];
  }
  ngOnInit(): void {
    console.log('create init');
  }
  handleSubmit() {
    console.log('submit');
  }
}
