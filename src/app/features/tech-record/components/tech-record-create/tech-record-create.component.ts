import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tech-record-create',
  templateUrl: './tech-record-create.component.html'
})
export class TechRecordCreateComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('tech record create');
  }
}
