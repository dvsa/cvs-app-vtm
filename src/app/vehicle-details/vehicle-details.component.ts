import { Component, OnInit } from '@angular/core';
import {VEHICLE_TYPES} from "@app/app.enums";
import {FormGroup} from "@angular/forms";
import {FormControl, Validators} from '@angular/forms';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import { map } from 'rxjs/operators';
import { CreateVehicleService } from '@app/create-vehicle/create-vehicle.service';


@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})

export class VehicleDetailsComponent implements OnInit {

  vehicleTypes : typeof VEHICLE_TYPES = VEHICLE_TYPES;
  vehicleDetailsForm : FormGroup;

  constructor(public activatedRoute: ActivatedRoute, private createFormData: CreateVehicleService){ }

  ngOnInit() {
    const isCreateForm = Object.keys(this.createFormData).length !== 0;
    this.vehicleDetailsForm = new FormGroup({
      'vin' : new FormControl(isCreateForm ? this.createFormData.createFormData["vin"] : null, Validators.required),
      'vrm' : new FormControl(isCreateForm ? this.createFormData.createFormData["vrm"] : null, Validators.required),
      'vehicleType': new FormControl( isCreateForm ? this.createFormData.createFormData["vehicleType"] : null, Validators.required)
    });
  }

  onSubmit(){
    // register vehicle in database
  }

}
