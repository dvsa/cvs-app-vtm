import {Component, HostBinding, OnInit} from '@angular/core';
import {initAll} from 'govuk-frontend';

@Component({
  selector: 'app-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.scss']
})

export class TechnicalRecordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    initAll();
  }

}
