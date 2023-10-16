import { Component } from '@angular/core';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { editingTechRecord, selectTechRecordChanges, techRecord } from '@store/technical-records';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-tech-record-summary-changes',
  templateUrl: './tech-record-summary-changes.component.html',
  styleUrls: ['./tech-record-summary-changes.component.scss']
})
export class TechRecordSummaryChangesComponent {
  techRecord$ = this.store.select(techRecord).pipe(filter(Boolean));
  techRecordEdited$ = this.store.select(editingTechRecord);
  techRecordChanges$ = this.store.select(selectTechRecordChanges);

  vehicleTemplates$ = this.techRecord$.pipe(
    map(techRecord =>
      vehicleTemplateMap.get(techRecord.techRecord_vehicleType as VehicleTypes)?.filter(template => template.name !== 'technicalRecordSummary')
    ),
    filter(Boolean)
  );

  customVehicleTemplate$ = this.techRecordChanges$.pipe(
    map(changes => Object.entries(changes).filter(([_, value]) => value != null && value !== '' && Object.keys(value).length > 0)),
    map(entries => entries.map(([key]) => key)),
    switchMap(keys =>
      this.vehicleTemplates$.pipe(
        map(vehicleTemplates =>
          vehicleTemplates.map(vehicleTemplate => ({
            ...vehicleTemplate,
            viewType: vehicleTemplate.viewType === FormNodeViewTypes.HIDDEN ? FormNodeViewTypes.STRING : vehicleTemplate.viewType,
            children: vehicleTemplate.children
              ?.filter(child => keys.includes(child.name))
              .map(child => ({ ...child, viewType: child.viewType === FormNodeViewTypes.HIDDEN ? FormNodeViewTypes.STRING : child.viewType }))
          }))
        )
      )
    ),
    map(templates => templates.filter(template => template && template.children && template.children.length > 0))
  );

  constructor(private readonly store: Store<State>, public readonly technicalRecordService: TechnicalRecordService) {}

  get vehicleSummary(): FormNode {
    const control = {
      name: 'vehicleSummary',
      label: 'Vehicle Summary',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'vin',
          label: 'Vehicle identification number (VIN)',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXT
        },
        {
          name: 'primaryVrm',
          label: 'Vehicle registration mark (VRM)',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXT
        },
        {
          name: 'techRecord_vehicleType',
          label: 'Vehicle type',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXT
        },
        {
          name: 'techRecord_manufactureYear',
          label: 'Year of manufacture',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXT
        },
        {
          name: 'techRecord_make',
          label: 'Make',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXT
        },
        {
          name: 'techRecord_model',
          label: 'Model',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXT
        }
      ]
    };

    return control as FormNode;
  }
}
