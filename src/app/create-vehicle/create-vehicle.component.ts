import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {forkJoin, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { VEHICLE_TYPES } from '../app.enums';
import { TechnicalRecordService } from '../components/technical-record/technical-record.service';
import { CreateVehicleService } from './create-vehicle.service';
import {AdrReasonModalComponent} from "@app/components/adr-reason-modal/adr-reason-modal.component";


@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.scss']
})

export class CreateVehicleComponent implements OnInit {

  vehicleTypes: typeof VEHICLE_TYPES = VEHICLE_TYPES;
  createVehicleForm: FormGroup;

  constructor(private techRecordService: TechnicalRecordService, private router: Router, private createFormData: CreateVehicleService,
              public matDialog: MatDialog) {
  }

  ngOnInit() {
    this.createVehicleForm = new FormGroup({
      'vin': new FormControl(null, Validators.required),
      'vrm': new FormControl(null, Validators.required),
      'vehicleType': new FormControl(null, Validators.required)
    });
  }

  onSubmit(vehicleData) {
    console.log(vehicleData);
    const techRecByVin = this.techRecordService.getTechnicalRecords(this.createVehicleForm.get('vin').value);
    const techRecByVrm = this.techRecordService.getTechnicalRecords(this.createVehicleForm.get('vrm').value);

    forkJoin([techRecByVin, techRecByVrm])
      .subscribe(
        data => {
          if (Object.keys(data[0]).length === 0 && Object.keys(data[1]).length === 0) {
            this.createFormData.createFormData = vehicleData;
            this.router.navigate(['/details']);
          } else {
            const errorDialog = new MatDialogConfig();
            this.matDialog.open(AdrReasonModalComponent, errorDialog);
            this.createVehicleForm.reset();
          }
        },
        err => {
          console.error(err);
        }
      );

  }

}
