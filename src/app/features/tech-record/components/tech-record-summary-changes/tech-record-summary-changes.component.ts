import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HGVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TRLAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechRecordGETHGV, TechRecordGETPSV, TechRecordGETTRL } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { FormNode, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { VehicleSummary } from '@forms/templates/tech-records/vehicle-summary.template';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { editingTechRecord, selectTechRecordChanges, selectTechRecordDeletions, techRecord } from '@store/technical-records';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tech-record-summary-changes',
  templateUrl: './tech-record-summary-changes.component.html',
  styleUrls: ['./tech-record-summary-changes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryChangesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  techRecord?: TechRecordType<'get'>;
  techRecordEdited?: TechRecordType<'put'>;
  techRecordChanges?: Partial<TechRecordType<'get'>>;
  techRecordDeletions?: Partial<TechRecordType<'get'>>;

  sectionState?: (string | number)[];

  constructor(private readonly store: Store<State>, private readonly technicalRecordService: TechnicalRecordService) {}

  ngOnInit(): void {
    // Retrieve the current and modified tech records from state, as well as an object representing their differences
    this.store
      .select(techRecord)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(techRecord => (this.techRecord = techRecord));

    this.store
      .select(editingTechRecord)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(editingTechRecord => (this.techRecordEdited = editingTechRecord));

    this.store
      .select(selectTechRecordChanges)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(changes => (this.techRecordChanges = changes));

    this.store
      .select(selectTechRecordDeletions)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(deletions => (this.techRecordDeletions = deletions));

    this.technicalRecordService.sectionStates$.pipe(take(1), takeUntil(this.destroy$)).subscribe(data => (this.sectionState = data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicleSummary(): FormNode {
    return VehicleSummary;
  }

  get deletedAxles(): HGVAxles[] | TRLAxles[] | PSVAxles[] {
    if (this.techRecordEdited?.techRecord_vehicleType === 'hgv')
      return Object.values((this.techRecordChanges as Partial<TechRecordGETHGV>).techRecord_axles ?? {}) as [HGVAxles, ...HGVAxles[]];

    if (this.techRecordEdited?.techRecord_vehicleType === 'trl')
      return Object.values((this.techRecordChanges as Partial<TechRecordGETTRL>).techRecord_axles ?? {}) as [TRLAxles, ...TRLAxles[]];

    if (this.techRecordEdited?.techRecord_vehicleType === 'psv')
      return Object.values((this.techRecordChanges as Partial<TechRecordGETPSV>).techRecord_axles ?? {}) as [PSVAxles, ...PSVAxles[]];

    return [] as HGVAxles[] | TRLAxles[] | PSVAxles[];
  }

  get techRecordChangesKeys(): string[] {
    return Object.entries(this.techRecordChanges ?? {})
      .filter(([_, value]) => this.isNotEmpty(value))
      .map(([key]) => key);
  }

  get vehicleTemplates() {
    return vehicleTemplateMap
      .get(this.techRecordEdited?.techRecord_vehicleType as VehicleTypes)
      ?.filter(template => template.name !== 'technicalRecordSummary');
  }

  get customVehicleTemplate() {
    return this.vehicleTemplates?.map(vehicleTemplate => ({
      // Copy the template group properties, and ensure everything is shown
      ...this.toVisibleFormNode(vehicleTemplate),
      children: vehicleTemplate.children?.filter(child => this.techRecordChangesKeys.includes(child.name)).map(child => this.toVisibleFormNode(child))
    }));
  }

  isNotEmpty(value: unknown): boolean {
    return value != null && value !== '' && Object.keys(value).length > 0;
  }

  toVisibleFormNode(node: FormNode): FormNode {
    return { ...node, viewType: node.viewType === FormNodeViewTypes.HIDDEN ? FormNodeViewTypes.STRING : node.viewType };
  }
}
