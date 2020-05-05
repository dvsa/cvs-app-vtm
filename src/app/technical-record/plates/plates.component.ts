import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Plate } from '../../models/tech-record.model';
@Component({
  selector: 'vtm-plates',
  templateUrl: './plates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatesComponent implements OnInit {

  @Input() plates: Plate[];
  constructor() { }

  ngOnInit() {
  }

}
