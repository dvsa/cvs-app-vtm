import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'vtm-adr-reason-modal',
  templateUrl: './adr-reason-modal.component.html',
  styleUrls: ['./adr-reason-modal.component.scss']
})
export class AdrReasonModalComponent implements OnInit {

  formData: any;

  constructor(public dialogRef: MatDialogRef<AdrReasonModalComponent>, @Optional() @Inject(MAT_DIALOG_DATA) data : any) {
    this.formData = data;
  }

  ngOnInit() {

  }

  onSubmit(){
    // before PUT don't forget: Date (DD MM YYYY), converted to YYYY-MM-DD upon saving (as per ACs) -> this.adrDetailsForm.approvalDate
    // weight in KG -> divide by 1000

    // !!! Add reasonForCreation from modal to formData too

    console.log(this.formData);

  }

  close(): void {
    this.dialogRef.close();
  }

}
