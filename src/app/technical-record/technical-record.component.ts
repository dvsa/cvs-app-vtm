import { Component, OnInit } from '@angular/core';
import { TechnicalRecordService } from './technical-record.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.css']
})
export class TechnicalRecordComponent implements OnInit {
  techRecords: any;
  isLoading: boolean;
  searchIdentifier: string = '<search identifier>';

  constructor(private techRecordService: TechnicalRecordService) { }

  ngOnInit() {
    this.isLoading = true;
    this.techRecordService.getTechnicalRecords(this.searchIdentifier)
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe((techRecords: any) => {
      this.techRecords = techRecords;
    });
  }

}
