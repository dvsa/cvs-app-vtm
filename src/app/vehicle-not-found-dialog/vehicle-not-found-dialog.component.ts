import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-vehicle-not-found-dialog',
  templateUrl: './vehicle-not-found-dialog.component.html',
  styleUrls: ['./vehicle-not-found-dialog.component.scss']
})
export class VehicleNotFoundDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VehicleNotFoundDialogComponent>) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

}
