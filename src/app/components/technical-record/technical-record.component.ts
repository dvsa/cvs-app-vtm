import { Component, OnInit } from '@angular/core';
import { TechnicalRecordService } from './technical-record.service';
import { finalize } from 'rxjs/operators';
import { TechnicalRecordModel, Axle } from './technical-record.model';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {VehicleNotFoundDialogComponent} from "@app/vehicle-not-found-dialog/vehicle-not-found-dialog.component";

@Component({
  selector: 'app-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.scss']
})
export class TechnicalRecordComponent implements OnInit {
  techRecords: TechnicalRecordModel[];
  techRecordsJson: any;
  isLoading: boolean;
  searchIdentifier: string = '{none searched}';
  searchValue:string = '';

  constructor(private techRecordService: TechnicalRecordService, public matDialog: MatDialog) { }

  ngOnInit() { }

  private transformer(): TechnicalRecordModel[] {

      return this.techRecordsJson.techRecord.map( _ => new TechnicalRecordModel({
        StatusCode: _.statusCode,
        BodyDescription: _.bodyType.description,
        GrossKerbWeight: _.grossKerbWeight,
        BrakeCode: _.brakeCode,
        LastUpdatedAt: new Date(_.lastUpdatedAt).toLocaleDateString(),
        SeatsUpperDeck: _.seatsUpperDeck,
        StandingCapacity: _.standingCapacity,
        BrakeCodeOriginal: _.brakes.brakeCodeOriginal,
        BreakCode: _.brakes.brakeCode,
        RetarderBrakeOne: _.brakes.retarderBrakeOne,
        UnlkParkBrakeForce: _.brakes.brakeForceWheelsNotLocked.parkingBrakeForceA,
        UnlkSvcBrakeForce: _.brakes.brakeForceWheelsNotLocked.serviceBrakeForceA,
        UnlkSecBrakeForce: _.brakes.brakeForceWheelsNotLocked.secondaryBrakeForceA,
        DataTrBrakeTwo: _.brakes.dataTrBrakeTwo,
        BodyModel: _.bodyModel,
        BodyMake: _.bodyMake,
        ConversionRefNo: _.conversionRefNo,
        GrossLadenWeight: _.grossLadenWeight,
        ChassisModel: _.chassisModel,
        details: _.axles.map(axle => new Axle({
          AxleNumber: axle.axleNumber,
          TyreSize: axle.tyres.tyreSize,
          SpeedCategorySymbol: axle.tyres.speedCategorySymbol,
          FitmentCode: axle.tyres.fitmentCode,
          DataTrAxles: axle.tyres.dataTrAxles,
          PlyRating: axle.tyres.plyRating,
          TyreCode: axle.tyres.tyreCode,
          ParkingBrakeMrk: axle.parkingBrakeMrk,
          KerbWeight: axle.weights.kerbWeight,
          GbWeight: axle.weights.gbWeight,
          LadenWeight: axle.weights.ladenWeight,
          DesignWeight: axle.weights.designWeight
        }))
      }));
  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this.techRecordService.getTechnicalRecordsAllStatuses(this.searchIdentifier)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((techRecords: any) => {
        if (Object.keys(techRecords).length === 0){
          const errorDialog = new MatDialogConfig();
          this.matDialog.open(VehicleNotFoundDialogComponent, errorDialog);
          this.searchValue = null;
        } else {
          this.techRecordsJson = techRecords;
          //console.log(`received techrecord ${typeof JSON.stringify(this.techRecordsJson)}`);
          this.techRecords = this.transformer();
          //console.log(`transformed techrecord ${JSON.stringify(this.techRecords)}`);
          this.isLoading = true;
        }
      });
  }

}
