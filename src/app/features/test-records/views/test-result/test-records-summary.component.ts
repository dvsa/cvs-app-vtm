import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { PsvAnnual } from '@forms/templates/psv/psv-annual.template';
import { PsvBody } from '@forms/templates/psv/psv-body';
import { PsvBrakeSection } from '@forms/templates/psv/psv-brake.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { firstValueFrom, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { FormNode } from 'src/app/forms/services/dynamic-form.types';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-records-summary.component.html',
  styleUrls: ['./test-records-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit, OnDestroy {
  testResult$: Observable<TestResultModel | undefined>;
  template: FormNode | undefined;
  defectTpl: FormNode;
  defectsData$: Observable<Defects | undefined>;
  vehicleType!: string;

  private destroy$ = new Subject<void>();
  masterTpl = {
    psv: {
      PsvAnnual
    }
  };

  constructor(private testRecordsService: TestRecordsService) {
    this.testResult$ = this.testRecordsService.testResult$;
    this.defectTpl = DefectTpl;
    this.defectsData$ = this.testRecordsService.defectData$;
  }

  ngOnInit(): void {
    this.watchVehicleType();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  watchVehicleType() {
    this.testResult$.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      switch (result?.vehicleType) {
        case VehicleTypes.PSV:
          this.template = PsvAnnual;
          console.log('psv');
          break;
        default:
          console.log('oh no!');
      }
    });
  }

  get vehicleTypes() {
    return VehicleTypes;
  }
}
