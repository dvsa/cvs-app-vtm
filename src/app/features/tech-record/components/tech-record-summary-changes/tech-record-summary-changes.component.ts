import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TechRecordGETHGV, TechRecordGETPSV, TechRecordGETTRL } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { FormNode, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { VehicleSummary } from '@forms/templates/tech-records/vehicle-summary.template';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import {
  editingTechRecord,
  selectTechRecordAdditions,
  selectTechRecordChanges,
  selectTechRecordDeletions,
  selectTechRecordModifications,
  techRecord,
} from '@store/technical-records';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-tech-record-summary-changes',
  templateUrl: './tech-record-summary-changes.component.html',
  styleUrls: ['./tech-record-summary-changes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechRecordSummaryChangesComponent {
  // Retrieve the current and modified tech records from state, as well as an object representing their differences
  techRecord$ = this.store.select(techRecord).pipe(filter(Boolean));
  techRecordEdited$ = this.store.select(editingTechRecord);
  techRecordChanges$ = this.store.select(selectTechRecordChanges);

  // Retrieve the additions, modifications, and deletions seperately, so they can be properly demarcated by the UI
  techRecordAdditions$ = this.store.select(selectTechRecordAdditions);
  techRecordModifications$ = this.store.select(selectTechRecordModifications);
  techRecordDeletions$ = this.store.select(selectTechRecordDeletions);

  // For HGV, TRL, and PSV, we produce an array of added axles, by converting the changes object into an array
  addedAxles$ = this.techRecordEdited$.pipe(
    filter(Boolean),
    switchMap((record) =>
      this.techRecordAdditions$.pipe(
        map((additions) =>
          record.techRecord_vehicleType === 'hgv' || record.techRecord_vehicleType === 'trl' || record.techRecord_vehicleType === 'psv'
            ? Object.values((additions as Partial<TechRecordGETHGV | TechRecordGETTRL | TechRecordGETPSV>).techRecord_axles ?? {})
            : []),
      )),
  );

  // For HGV, TRL, and PSV, we produce an array of modified axles, by converting the changes object into an array
  modifiedAxles$ = this.techRecordEdited$.pipe(
    filter(Boolean),
    switchMap((record) =>
      this.techRecordModifications$.pipe(
        map((modifications) =>
          record.techRecord_vehicleType === 'hgv' || record.techRecord_vehicleType === 'trl' || record.techRecord_vehicleType === 'psv'
            ? Object.entries((modifications as Partial<TechRecordGETHGV | TechRecordGETTRL | TechRecordGETPSV>).techRecord_axles ?? {})
            // set the key to be the axle number, as this is absent from the changes object
              .map(([key, value]) => ({ ...value, axleNumber: +key + 1 }))
            : []),
      )),
  );

  // For HGV, TRL, and PSV, we produce an array of deleted axles, by converting the changes object into an array
  deletedAxles$ = this.techRecordEdited$.pipe(
    filter(Boolean),
    switchMap((record) =>
      this.techRecordDeletions$.pipe(
        map((deletions) =>
          record.techRecord_vehicleType === 'hgv' || record.techRecord_vehicleType === 'trl' || record.techRecord_vehicleType === 'psv'
            ? Object.values((deletions as Partial<TechRecordGETHGV | TechRecordGETTRL | TechRecordGETPSV>).techRecord_axles ?? {})
            : []),
      )),
  );

  // Find the keys of the changes to the tech record which aren't populated by the server
  techRecordChangesKeys$ = this.techRecordChanges$.pipe(
    map((changes) => Object.entries(changes).filter(([_, value]) => this.isNotEmpty(value))),
    map((entries) => entries.map(([key]) => key)),
  );

  // Find only the templates which display technical record summary data
  vehicleTemplates$ = this.techRecord$.pipe(
    map((record) =>
      vehicleTemplateMap.get(record.techRecord_vehicleType as VehicleTypes)?.filter((template) => template.name !== 'technicalRecordSummary')),
    filter(Boolean),
  );

  // Use tech record changes to construct a custom template for displaying the partial technical record data
  customVehicleTemplate$ = this.techRecordChangesKeys$.pipe(
    switchMap((keys) =>
      this.vehicleTemplates$.pipe(
        map((vehicleTemplates) =>
          vehicleTemplates.map((vehicleTemplate) => ({
            // Copy the template group properties, and ensure everything is shown
            ...this.toVisibleFormNode(vehicleTemplate),

            // Now uses these keys to exclude children of the technical record summary template which weren't changed by the user
            children: vehicleTemplate.children?.filter((child) => keys.includes(child.name)).map((child) => this.toVisibleFormNode(child)),
          }))),
      )),

    // Finally, filter out empty template sections to avoid showing headers with no data
    map((sections) => sections.filter((section) => section && section.children && section.children.length > 0)),
  );

  constructor(private readonly store: Store<State>, public readonly technicalRecordService: TechnicalRecordService) {}

  get vehicleSummary(): FormNode {
    return VehicleSummary;
  }

  get axleTemplate() {
    const control = {
      columns: [
        {
          name: 'name',
          heading: '',
          order: 1,
        },
        {
          name: 'weights_gbWeight',
          heading: 'GB Weight',
          order: 2,
        },
        {
          name: 'weights_eecWeight',
          heading: 'EEC Weight',
          order: 3,
        },
        {
          name: 'weights_designWeight',
          heading: 'Design Weight',
          order: 4,
        },
      ],
    };

    return control;
  }

  isNotEmpty(value: unknown): boolean {
    return value != null && value !== '' && Object.keys(value).length > 0;
  }

  toVisibleFormNode(node: FormNode): FormNode {
    return { ...node, viewType: node.viewType === FormNodeViewTypes.HIDDEN ? FormNodeViewTypes.STRING : node.viewType };
  }
}
