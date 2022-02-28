import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { Microfilm } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-documents',
  templateUrl: './documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsComponent implements OnInit {
  @Input() editState: boolean;
  @Input() microfilm: Microfilm;

  constructor() {}

  ngOnInit() {}
}
