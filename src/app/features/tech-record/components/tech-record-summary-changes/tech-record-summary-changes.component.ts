import {
  ChangeDetectionStrategy, Component, computed, inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordGETHGV, TechRecordGETPSV, TechRecordGETTRL } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { FormNode, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { VehicleSummary } from '@forms/templates/tech-records/vehicle-summary.template';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import {
  clearADRDetailsBeforeUpdate,
  clearAllSectionStates,
  clearScrollPosition,
  editingTechRecord,
  selectTechRecordChanges,
  selectTechRecordDeletions,
  techRecord,
  updateADRAdditionalExaminerNotes,
  updateTechRecord,
  updateTechRecordSuccess,
} from '@store/technical-records';
import { name } from '@store/user/user-service.reducer';

@Component({
  selector: 'app-tech-record-summary-changes',
  templateUrl: './tech-record-summary-changes.component.html',
  styleUrls: ['./tech-record-summary-changes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechRecordSummaryChangesComponent {
  // Services
  store = inject(Store);
  router = inject(Router);
  actions = inject(Actions);
  route = inject(ActivatedRoute);
  technicalRecordService = inject(TechnicalRecordService);
  globalErrorService = inject(GlobalErrorService);

  // Data sources
  name = this.store.selectSignal(name);
  techRecord = this.store.selectSignal(techRecord);
  techRecordEdited = this.store.selectSignal(editingTechRecord);
  techRecordChanges = this.store.selectSignal(selectTechRecordChanges);
  techRecordDeletions = this.store.selectSignal(selectTechRecordDeletions);

  // Derrived data sources
  vehicleType = computed(() => {
    const record = this.techRecordEdited();
    return record ? this.technicalRecordService.getVehicleTypeWithSmallTrl(record) : undefined;
  });

  vehicleTemplates = computed(() => {
    return vehicleTemplateMap
      .get(this.techRecordEdited()?.techRecord_vehicleType as VehicleTypes)
      ?.filter((template) => template.name !== 'technicalRecordSummary') ?? [];
  });

  techRecordChangesKeys = computed(() => {
    const entries = Object.entries(this.techRecordChanges() ?? {});
    const filter = entries.filter(([, value]) => this.isNotEmpty(value));
    const changeMap = filter.map(([key]) => key);
    return changeMap;
  });

  sectionsWhitelist = computed(() => {
    const whitelist: string[] = [];
    const vehicleType = this.vehicleType();
    const techRecordChanges = this.techRecordChanges();
    if (vehicleType == null) return whitelist;
    if (techRecordChanges == null) return whitelist;
    if (this.technicalRecordService.haveAxlesChanged(vehicleType, techRecordChanges)) {
      whitelist.push('weightsSection');
    }

    return whitelist;
  });

  customVehicleTemplate = computed(() => {
    return this.vehicleTemplates()
      ?.map((vehicleTemplate) => ({
        ...this.toVisibleFormNode(vehicleTemplate),
        children: vehicleTemplate.children
          ?.filter((child) => {
            return this.techRecordChangesKeys().includes(child.name);
          })
          .map((child) => this.toVisibleFormNode(child)),
      }))
      .filter((section) => Boolean(section && section.children && section.children.length > 0) || this.sectionsWhitelist().includes(section.name));
  });

  changesForWeights = computed(() => {
    const techRecordEdited = this.techRecordEdited();
    if (techRecordEdited == null) return undefined;

    return ['hgv', 'trl', 'psv'].includes(techRecordEdited.techRecord_vehicleType)
      ? (this.techRecordChanges() as Partial<TechRecordGETHGV | TechRecordGETPSV | TechRecordGETTRL>)
      : undefined;
  });

  deletedAxles = computed(() => {
    const techRecordEdited = this.techRecordEdited();
    const techRecordDeletions = this.techRecordDeletions();

    if (techRecordEdited?.techRecord_vehicleType === 'hgv' && techRecordDeletions) {
      return Object.values((techRecordDeletions as Partial<TechRecordGETHGV>).techRecord_axles ?? {});
    }

    if (techRecordEdited?.techRecord_vehicleType === 'trl' && techRecordDeletions) {
      return Object.values((techRecordDeletions as Partial<TechRecordGETTRL>).techRecord_axles ?? {});
    }

    if (techRecordEdited?.techRecord_vehicleType === 'psv' && techRecordDeletions) {
      return Object.values((techRecordDeletions as Partial<TechRecordGETPSV>).techRecord_axles ?? {});
    }

    return [];
  });

  // Properties
  vehicleSummary = VehicleSummary;
  sectionTemplatesState: string[] = [];

  constructor() {
    this.actions.pipe(ofType(updateTechRecordSuccess), takeUntilDestroyed()).subscribe((vehicleTechRecord) => {
      this.store.dispatch(clearAllSectionStates());
      this.store.dispatch(clearScrollPosition());
      void this.router.navigate([
        `/tech-records/${vehicleTechRecord.vehicleTechRecord.systemNumber}/${vehicleTechRecord.vehicleTechRecord.createdTimestamp}`,
      ]);
    });
  }

  // Methods
  toVisibleFormNode(node: FormNode): FormNode {
    return { ...node, viewType: node.viewType === FormNodeViewTypes.HIDDEN ? FormNodeViewTypes.STRING : node.viewType };
  }

  isNotEmpty(value: unknown): boolean {
    if (value === '' || value === undefined) return false;
    if (typeof value === 'object' && value !== null) return Object.values(value).length > 0;
    return true;
  }

  cancel() {
    this.globalErrorService.clearErrors();
    void this.router.navigate(['..'], { relativeTo: this.route });
  }

  submit() {
    const { systemNumber, createdTimestamp } = this.store.selectSignal(selectRouteNestedParams)();

    if (systemNumber && createdTimestamp) {
      this.store.dispatch(updateADRAdditionalExaminerNotes({ username: this.name() }));
      this.store.dispatch(clearADRDetailsBeforeUpdate());
      this.store.dispatch(updateTechRecord({ systemNumber, createdTimestamp }));
    }
  }
}
