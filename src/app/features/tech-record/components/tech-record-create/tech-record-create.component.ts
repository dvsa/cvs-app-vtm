import { Component, OnInit } from '@angular/core';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';

@Component({
  selector: 'app-tech-record-create',
  templateUrl: './tech-record-create.component.html'
})
export class TechRecordCreateComponent implements OnInit {
  private vin: string = '';
  private isVinUnique: boolean = true;

  private vrm: string = '';
  private isVrmUnique: boolean = true;

  private trailerId: string = '';
  private isTrailerIdUnique: boolean = true;

  constructor(private technicalRecordService: TechnicalRecordService) {}

  ngOnInit(): void {
    console.log('tech record create');
  }

  private areValuesUnique() {
    this.technicalRecordService.isUnique(this.vin, SEARCH_TYPES.VIN).subscribe(data => (this.isVinUnique = data));
    this.technicalRecordService.isUnique(this.vrm, SEARCH_TYPES.VRM).subscribe(data => (this.isVrmUnique = data));
    this.technicalRecordService.isUnique(this.trailerId, SEARCH_TYPES.TRAILER_ID).subscribe(data => (this.isTrailerIdUnique = data));
  }
}
