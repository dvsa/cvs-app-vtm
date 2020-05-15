import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'vtm-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionItemComponent implements OnInit {
  @Input() title: string;
  titleTrimmed: string;

  constructor() {}

  ngOnInit() {
    this.titleTrimmed = !!this.title ? this.title.replace(/\s/g, '') : '';
  }
}
