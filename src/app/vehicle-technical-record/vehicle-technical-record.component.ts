import { Component, Input } from '@angular/core';
import { TechRecord } from '../models/tech-record.model';

// largely copied from  archive/../vehicle-summary.component.ts
@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html',
  styleUrls: ['./vehicle-technical-record.component.scss']
})
export class VehicleTechnicalRecordComponent{
  @Input() technicalRecord?: TechRecord;

  constructor() { }

  get vehicleClassDescription(): string | undefined {
    return this.technicalRecord?.vehicleClass.description;
  }

  get isStandardVehicle(): boolean {
    return (
      'hgv' === this.technicalRecord?.vehicleType ||
      'trl' === this.technicalRecord?.vehicleType ||
      'psv' === this.technicalRecord?.vehicleType);
  }

  axlesHasParkingBrakeMrk(): boolean {
    return (
      this.technicalRecord != undefined &&
      this.technicalRecord.axles &&
      this.technicalRecord.axles.length > 0 &&
      this.technicalRecord.axles.some((x) => x.parkingBrakeMrk)
    );
  }

  record = [{"testerStaffId":"1","testStartTimestamp":"2021-01-14T10:36:33.987Z","odometerReadingUnits":"kilometres","testEndTimestamp":"2021-01-14T10:36:33.987Z","testStatus":"submitted","testTypes":[{"prohibitionIssued":false,"testCode":"aas","testNumber":"1","lastUpdatedAt":"2021-02-22T08:47:59.269Z","testAnniversaryDate":"2020-12-22T08:47:59.749Z","testTypeClassification":"Annual With Certificate","additionalCommentsForAbandon":"none","customDefects":[{"defectName":"Some custom defect","defectNotes":"some defect noe","referenceNumber":"abcd"}],"numberOfSeatbeltsFitted":2,"testTypeEndTimestamp":"2021-01-14T10:36:33.987Z","reasonForAbandoning":"none","lastSeatbeltInstallationCheckDate":"2021-01-14","createdAt":"2021-02-22T08:47:59.269Z","testTypeId":"1","secondaryCertificateNumber":"1234","testTypeStartTimestamp":"2021-01-14T10:36:33.987Z","testTypeName":"Annual test","seatbeltInstallationCheckDate":true,"additionalNotesRecorded":"VEHICLE FRONT REGISTRATION PLATE MISSING","defects":[{"prohibitionIssued":false,"additionalInformation":{"location":{"axleNumber":null,"horizontal":null,"vertical":null,"longitudinal":"front","rowNumber":null,"lateral":null,"seatNumber":null},"notes":"None"},"itemNumber":1,"deficiencyRef":"1.1.a","stdForProhibition":false,"deficiencyId":"a","imNumber":1,"deficiencyCategory":"major","deficiencyText":"missing.","prs":false,"deficiencySubId":null,"imDescription":"Registration Plate","itemDescription":"A registration plate:"}],"name":"Annual test","certificateLink":"http://dvsagov.co.uk","testResult":"pass"},{"prohibitionIssued":false,"testCode":"pms","testNumber":"2","lastUpdatedAt":"2021-02-22T08:50:16.706Z","testTypeClassification":"Annual NO CERTIFICATE","additionalCommentsForAbandon":"none","customDefects":[{"defectName":"Some custom defect","defectNotes":"some defect noe","referenceNumber":"abcd"}],"numberOfSeatbeltsFitted":2,"testTypeEndTimestamp":"2021-01-14T10:36:33.987Z","reasonForAbandoning":"none","lastSeatbeltInstallationCheckDate":"2021-01-14","createdAt":"2021-02-22T08:50:16.706Z","testTypeId":"19","secondaryCertificateNumber":"1234","testTypeStartTimestamp":"2021-01-14T10:36:33.987Z","testTypeName":"Annual test","seatbeltInstallationCheckDate":true,"additionalNotesRecorded":"VEHICLE FRONT ROW SECOND SEAT HAS MISSING SEATBELT","defects":[{"prohibitionIssued":true,"additionalInformation":{"location":{"axleNumber":null,"horizontal":null,"vertical":"upper","longitudinal":null,"rowNumber":1,"lateral":"centre","seatNumber":2},"notes":"seatbelt missing"},"itemNumber":1,"deficiencyRef":"3.1.a","stdForProhibition":false,"deficiencyId":"a","imNumber":3,"deficiencyCategory":"major","deficiencyText":"missing.","prs":false,"deficiencySubId":null,"imDescription":"Seat Belts & Supplementary Restraint Systems","itemDescription":"Obligatory Seat Belt:"}],"name":"Annual test","certificateLink":"http://dvsagov.co.uk","testResult":"fail"},{"prohibitionIssued":false,"testCode":"aas","testNumber":"1","lastUpdatedAt":"2021-02-22T08:47:59.269Z","testAnniversaryDate":"2020-12-22T08:47:59.749Z","testTypeClassification":"Annual NO CERTIFICATE","additionalCommentsForAbandon":"none","customDefects":[{"defectName":"Some custom defect","defectNotes":"some defect noe","referenceNumber":"abcd"}],"numberOfSeatbeltsFitted":2,"testTypeEndTimestamp":"2021-01-14T10:36:33.987Z","reasonForAbandoning":"none","lastSeatbeltInstallationCheckDate":"2021-01-14","createdAt":"2021-02-22T08:47:59.269Z","testTypeId":"19","secondaryCertificateNumber":"1234","testTypeStartTimestamp":"2021-01-14T10:36:33.987Z","testTypeName":"Annual test","seatbeltInstallationCheckDate":true,"additionalNotesRecorded":"VEHICLE FRONT REGISTRATION PLATE MISSING","defects":[{"prohibitionIssued":true,"additionalInformation":{"location":{"axleNumber":null,"horizontal":null,"vertical":null,"longitudinal":"front","rowNumber":null,"lateral":null,"seatNumber":null},"notes":"None"},"itemNumber":1,"deficiencyRef":"1.1.a","stdForProhibition":false,"deficiencyId":"a","imNumber":1,"deficiencyCategory":"major","deficiencyText":"missing.","prs":false,"deficiencySubId":null,"imDescription":"Registration Plate","itemDescription":"A registration plate:"}],"name":"Annual test","certificateLink":"http://dvsagov.co.uk","testResult":"prs"}],"systemNumber":"11000001","vehicleClass":{"description":"motorbikes over 200cc or with a sidecar","code":"2"},"testResultId":"1","vin":"XMGDE02FS0H012345","vehicleSize":"small","testStationName":"Rowe, Wunsch and Wisoky","vehicleId":"JY58FPP","noOfAxles":2,"vehicleType":"psv","countryOfRegistration":"united kingdom","preparerId":"ak4434","preparerName":"Durrell Vehicles Limited","odometerReading":100000,"vehicleConfiguration":"rigid","testStationType":"gvts","reasonForCancellation":"none","testerName":"Dorel","vrm":"JY58FPP","testStationPNumber":"87-1369569","numberOfSeats":45,"testerEmailAddress":"dorel.popescu@dvsagov.uk","euVehicleCategory":"m2","numberOfWheelsDriven":3}];

  // export enum VEHICLE_TYPES {
  //   PSV = 'psv',
  //   HGV = 'hgv',
  //   TRL = 'trl',
  //   Car = 'car',
  //   LGV = 'lgv',
  //   Moto = 'motorcycle'
  // }

}
