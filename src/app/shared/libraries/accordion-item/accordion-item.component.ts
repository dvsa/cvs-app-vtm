import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'vtm-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionItemComponent implements OnInit {
  @Input() title: string;

  constructor() {}

  ngOnInit() {}
}
