import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, Vrm } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { Observable, of, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html',
  styleUrls: ['./vehicle-technical-record.component.scss']
})
export class VehicleTechnicalRecordComponent implements OnInit, OnDestroy {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;
  records: Observable<TestResultModel[]> = of([]);
  ngDestroy$ = new Subject();

  constructor(testRecordService: TestRecordsService, private store: Store) {
    this.records = testRecordService.testRecords$;
  }

  ngOnInit(): void {
    this.currentTechRecord = this.viewableTechRecord(this.vehicleTechRecord);
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find((vrm) => vrm.isPrimary === true)?.vrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vehicleTechRecord?.vrms.filter((vrm) => vrm.isPrimary === false);
  }

  /**
   * A function to get the correct tech record to create the summary display which uses time first then status code
   * @param record This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  viewableTechRecord(record?: VehicleTechRecordModel): TechRecordModel | undefined {
    let viewableTechRecord = undefined;

    this.store.pipe(select(selectRouteNestedParams)).pipe(takeUntil(this.ngDestroy$)).subscribe((params) => {
      const createdAt = params['techCreatedAt'] ?? '';
      viewableTechRecord = record?.techRecord?.find((record) => new Date(record.createdAt).getTime() == createdAt);
    });

    if (!viewableTechRecord) {
      viewableTechRecord = this.filterTechRecordByStatusCode(record)
    }

    return viewableTechRecord;
  }

  /**
   * A function to filter the correct tech record, this has a hierarchy which is PROVISIONAL -> CURRENT -> ARCHIVED.
   * @param record This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  filterTechRecordByStatusCode(record?: VehicleTechRecordModel): TechRecordModel | undefined {
    let filteredTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.PROVISIONAL);

    if (filteredTechRecord == undefined) {
      filteredTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.CURRENT);
    }

    if (filteredTechRecord == undefined) {
      filteredTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.ARCHIVED);
    }

    return filteredTechRecord;
  }

  ngOnDestroy(){
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }
}
