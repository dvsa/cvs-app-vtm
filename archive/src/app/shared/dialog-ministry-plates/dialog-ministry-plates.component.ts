import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Applicant } from '@app/models/tech-record.model';

export interface DialogData {
  applicantDetails: Applicant;
}

@Component({
  selector: 'vtm-dialog-ministry-plates',
  templateUrl: './dialog-ministry-plates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogMinistryPlatesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogMinistryPlatesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {}

  close(): void {
    this.dialogRef.close(false);
  }

  save(plateComponent): void {
    const plate = plateComponent.platesForm.getRawValue();
    this.dialogRef.close(plate);
  }
}
