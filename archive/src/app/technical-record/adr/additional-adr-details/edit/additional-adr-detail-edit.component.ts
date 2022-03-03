import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { AdrDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-additional-adr-detail-edit',
  templateUrl: './additional-adr-detail-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalAdrDetailEditComponent extends AdrComponent implements OnInit {
  adrForm: FormGroup;
  @Input() adrDetails: AdrDetails;

  ngOnInit() {
    this.adrForm = super.setUp();

    this.adrForm.addControl(
      'additionalExaminerNotes',
      this.fb.control(this.adrDetails.additionalExaminerNotes)
    );

    this.adrForm.addControl(
      'adrCertificateNotes',
      this.fb.control(this.adrDetails.adrCertificateNotes)
    );
  }
}
