import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { BOOLEAN_RADIO_OPTIONS } from '@app/technical-record/technical-record.constants';

@Component({
  selector: 'vtm-certificate-edit',
  templateUrl: './certificate-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateEditComponent extends AdrComponent implements OnInit {
  adrForm: FormGroup;
  options;

  @Input() hasCertificateRequested: boolean;

  ngOnInit() {
    this.adrForm = super.setUp();
    this.options = BOOLEAN_RADIO_OPTIONS;

    const group: FormGroup = this.adrForm.get('additionalNotes') as FormGroup;

    if (group !== null) {
      group.addControl('guidanceNotes', this.fb.control(this.hasCertificateRequested));
    } else {
      this.adrForm.addControl(
        'additionalNotes',
        this.fb.group({
          guidanceNotes: this.fb.control(this.hasCertificateRequested)
        })
      );
    }
  }

  unsorted(): number {
    return super.unsorted();
  }
}
