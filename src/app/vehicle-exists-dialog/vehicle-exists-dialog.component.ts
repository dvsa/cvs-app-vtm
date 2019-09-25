import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-vehicle-exists-dialog',
  templateUrl: './vehicle-exists-dialog.component.html',
  styleUrls: ['./vehicle-exists-dialog.component.scss']
})

export class VehicleExistsDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<VehicleExistsDialogComponent> ) { }

  ngOnInit() { }

  close(): void {
    this.dialogRef.close();
  }

}
