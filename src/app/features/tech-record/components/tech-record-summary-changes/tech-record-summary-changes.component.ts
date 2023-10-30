import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { HGVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TRLAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechRecordGETHGV, TechRecordGETPSV, TechRecordGETTRL } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { FormNode, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { VehicleSummary } from '@forms/templates/tech-records/vehicle-summary.template';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import {
  clearAllSectionStates,
  clearScrollPosition,
  editingTechRecord,
  selectTechRecordChanges,
  selectTechRecordDeletions,
  techRecord,
  updateTechRecord,
  updateTechRecordSuccess,
} from '@store/technical-records';
import {
  Subject, combineLatest, map, take, takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-tech-record-summary-changes',
  templateUrl: './tech-record-summary-changes.component.html',
  styleUrls: ['./tech-record-summary-changes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechRecordSummaryChangesComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  techRecord?: TechRecordType<'get'>;
  techRecordEdited?: TechRecordType<'put'>;
  techRecordChanges?: Partial<TechRecordType<'get'>>;
  techRecordDeletions?: Partial<TechRecordType<'get'>>;
  techRecordChangesKeys: string[] = [];

  sectionsWhitelist: string[] = [];

  constructor(
    public store$: Store<State>,
    public technicalRecordService: TechnicalRecordService,
    public router: Router,
    public globalErrorService: GlobalErrorService,
    public route: ActivatedRoute,
    public routerService: RouterService,
    public actions$: Actions,
  ) { }

  ngOnInit(): void {
    this.navigateUponSuccess();
    this.initSubscriptions();
  }

  navigateUponSuccess(): void {
    this.actions$.pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$)).subscribe((vehicleTechRecord) => {
      this.store$.dispatch(clearAllSectionStates());
      this.store$.dispatch(clearScrollPosition());
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.router.navigate([
        `/tech-records/${vehicleTechRecord.vehicleTechRecord.systemNumber}/${vehicleTechRecord.vehicleTechRecord.createdTimestamp}`,
      ]);
    });
  }

  initSubscriptions(): void {
    this.store$
      .select(techRecord)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((data) => {
        if (!data) this.cancel();
        this.techRecord = data;
      });

    this.store$
      .select(editingTechRecord)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((data) => {
        this.techRecordEdited = data;
      });

    this.store$
      .select(selectTechRecordChanges)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((changes) => {
        this.techRecordChanges = changes;
        this.techRecordChangesKeys = this.getTechRecordChangesKeys();
        this.sectionsWhitelist = this.getSectionsWhitelist();
      });

    this.store$
      .select(selectTechRecordDeletions)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((deletions) => {
        this.techRecordDeletions = deletions;
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicleType() {
    return this.techRecordEdited ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecordEdited) : undefined;
  }

  get vehicleSummary(): FormNode {
    return VehicleSummary;
  }

  get deletedAxles(): HGVAxles[] | TRLAxles[] | PSVAxles[] {
    if (this.techRecordEdited?.techRecord_vehicleType === 'hgv' && this.techRecordDeletions) {
      return Object.values((this.techRecordDeletions as Partial<TechRecordGETHGV>).techRecord_axles ?? {}) as [HGVAxles, ...HGVAxles[]];
    }

    if (this.techRecordEdited?.techRecord_vehicleType === 'trl' && this.techRecordDeletions) {
      return Object.values((this.techRecordDeletions as Partial<TechRecordGETTRL>).techRecord_axles ?? {}) as [TRLAxles, ...TRLAxles[]];
    }

    if (this.techRecordEdited?.techRecord_vehicleType === 'psv' && this.techRecordDeletions) {
      return Object.values((this.techRecordDeletions as Partial<TechRecordGETPSV>).techRecord_axles ?? {}) as [PSVAxles, ...PSVAxles[]];
    }

    return [] as HGVAxles[] | TRLAxles[] | PSVAxles[];
  }

  get sectionTemplatesState$() {
    return this.technicalRecordService.sectionStates$;
  }

  isSectionExpanded$(sectionName: string | number) {
    return this.sectionTemplatesState$?.pipe(map((sections) => sections?.includes(sectionName)));
  }

  submit() {
    combineLatest([this.routerService.getRouteNestedParam$('systemNumber'), this.routerService.getRouteNestedParam$('createdTimestamp')])
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(([systemNumber, createdTimestamp]) => {
        if (systemNumber && createdTimestamp) {
          this.store$.dispatch(updateTechRecord({ systemNumber, createdTimestamp }));
        }
      });
  }

  cancel() {
    this.globalErrorService.clearErrors();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  getTechRecordChangesKeys(): string[] {
    const entries = Object.entries(this.techRecordChanges ?? {});
    const filter = entries.filter(([_, value]) => this.isNotEmpty(value));
    const changeMap = filter.map(([key]) => key);
    return changeMap;
  }

  getSectionsWhitelist() {
    const whitelist: string[] = [];
    if (this.vehicleType == null) return whitelist;
    if (this.techRecordChanges == null) return whitelist;
    if (this.technicalRecordService.haveAxlesChanged(this.vehicleType, this.techRecordChanges)) {
      whitelist.push('weightsSection');
    }

    return whitelist;
  }

  get changesForWeights() {
    if (this.techRecordEdited == null) return undefined;

    return ['hgv', 'trl', 'psv'].includes(this.techRecordEdited.techRecord_vehicleType)
      ? (this.techRecordChanges as Partial<TechRecordGETHGV | TechRecordGETPSV | TechRecordGETTRL>)
      : undefined;
  }

  get vehicleTemplates() {
    return vehicleTemplateMap
      .get(this.techRecordEdited?.techRecord_vehicleType as VehicleTypes)
      ?.filter((template) => template.name !== 'technicalRecordSummary');
  }

  get customVehicleTemplate() {
    return this.vehicleTemplates
      ?.map((vehicleTemplate) => ({
        ...this.toVisibleFormNode(vehicleTemplate),
        children: vehicleTemplate.children
          ?.filter((child) => this.techRecordChangesKeys.includes(child.name))
          .map((child) => this.toVisibleFormNode(child)),
      }))
      .filter((section) => Boolean(section && section.children && section.children.length > 0) || this.sectionsWhitelist.includes(section.name));
  }

  isNotEmpty(value: unknown): boolean {
    if (value === '') return false;
    if (typeof value === 'object' && value !== null) return Object.values(value).length > 0;
    return true;
  }

  toVisibleFormNode(node: FormNode): FormNode {
    return { ...node, viewType: node.viewType === FormNodeViewTypes.HIDDEN ? FormNodeViewTypes.STRING : node.viewType };
  }
}
