import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { tap, takeUntil } from 'rxjs/operators';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { AdrDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-declaration-seen-edit',
  templateUrl: './declaration-seen-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeclarationSeenEditComponent extends AdrComponent implements OnInit {
  adrForm: FormGroup;
  @Input() adrDetails: AdrDetails;

  ngOnInit() {
    this.adrForm = super.setUp();

    this.initControls();
    this.handleFormChanges();
  }

  initControls() {
    this.adrForm.addControl(
      'brakeDeclarationsSeen',
      this.fb.control(this.adrDetails.brakeDeclarationsSeen)
    );

    this.adrForm.addControl(
      'brakeDeclarationIssuer',
      this.fb.control(this.adrDetails.brakeDeclarationIssuer)
    );

    this.adrForm.addControl('brakeEndurance', this.fb.control(this.adrDetails.brakeEndurance));

    this.adrForm.addControl('weight', this.fb.control(this.adrDetails.weight));

    this.adrForm.addControl(
      'declarationsSeen',
      this.fb.control(this.adrDetails.declarationsSeen)
    );
  }

  handleFormChanges(): void {
    this.adrForm
      .get('brakeDeclarationsSeen')
      .valueChanges.pipe(
        tap((value) => {
          if (!value) {
            this.adrForm.get('brakeDeclarationIssuer').reset();
            this.adrForm.get('brakeEndurance').reset();
          }
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();

    this.adrForm
      .get('brakeEndurance')
      .valueChanges.pipe(
        tap((value) => {
          if (!value) {
            this.adrForm.get('weight').reset();
          }
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }
}
