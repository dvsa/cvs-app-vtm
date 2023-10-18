import { Component, Input, OnInit } from '@angular/core';
import { TechRecordGETHGV, TechRecordGETPSV, TechRecordGETTRL } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { FormNode } from '@forms/services/dynamic-form.types';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-modified-weights',
  templateUrl: './modified-weights.component.html',
  styleUrls: ['./modified-weights.component.scss'],
})
export class ModifiedWeightsComponent implements OnInit {
  @Input() vehicleType!: VehicleTypes;
  @Input() changes!: Partial<TechRecordGETPSV | TechRecordGETHGV | TechRecordGETTRL>;

  axleTemplate: FormNode[] | undefined;
  psvGrossAxisChanged = false;
  hgvAndTrlGrossAxisChanged = false;
  hgvTrainAxisChanged = false;
  psvTrainAxisChanged = false;
  maxTrainAxisChanged = false;

  get psvChanges(): Partial<TechRecordGETPSV> | undefined {
    return this.vehicleType === VehicleTypes.PSV ? (this.changes as Partial<TechRecordGETPSV>) : undefined;
  }

  get hgvChanges(): Partial<TechRecordGETHGV> | undefined {
    return this.vehicleType === VehicleTypes.HGV ? (this.changes as Partial<TechRecordGETHGV>) : undefined;
  }

  get trlChanges(): Partial<TechRecordGETTRL> | undefined {
    return this.vehicleType === VehicleTypes.TRL ? (this.changes as Partial<TechRecordGETTRL>) : undefined;
  }

  ngOnInit(): void {
    this.axleTemplate = this.getAxleTemplate();
    this.psvGrossAxisChanged = this.getPsvGrossAxisChanged();
    this.hgvAndTrlGrossAxisChanged = this.getHgvAndTrlGrossAxisChanged();
    this.hgvTrainAxisChanged = this.getHgvTrainAxisChanged();
    this.psvTrainAxisChanged = this.getPsvTrainAxisChanged();
    this.maxTrainAxisChanged = this.getMaxTrainAxisChanged();
  }

  getAxleTemplate(): FormNode[] | undefined {
    return vehicleTemplateMap
      .get(this.vehicleType)
      ?.find((template) => template.name === 'weightsSection')
      ?.children?.find((child) => child.name === 'techRecord_axles')
      ?.children?.at(0)
      ?.children?.filter((child) => child.name !== 'axleNumber');
  }

  getPsvGrossAxisChanged(): boolean {
    const changes = this.changes as TechRecordGETPSV;
    return [
      changes.techRecord_grossKerbWeight,
      changes.techRecord_grossDesignWeight,
      changes.techRecord_grossLadenWeight,
      changes.techRecord_grossGbWeight,
    ].some(Boolean);
  }

  getHgvAndTrlGrossAxisChanged(): boolean {
    const changes = this.changes as TechRecordGETHGV | TechRecordGETTRL;
    return [changes.techRecord_grossEecWeight, changes.techRecord_grossDesignWeight, changes.techRecord_grossGbWeight].some(Boolean);
  }

  getHgvTrainAxisChanged(): boolean {
    const changes = this.changes as TechRecordGETHGV;
    return [changes.techRecord_trainDesignWeight, changes.techRecord_trainGbWeight, changes.techRecord_trainEecWeight].some(Boolean);
  }

  getPsvTrainAxisChanged(): boolean {
    const changes = this.changes as TechRecordGETPSV;
    return [changes.techRecord_trainDesignWeight, changes.techRecord_maxTrainGbWeight].some(Boolean);
  }

  getMaxTrainAxisChanged(): boolean {
    const changes = this.changes as TechRecordGETHGV;
    return [changes.techRecord_maxTrainDesignWeight, changes.techRecord_maxTrainEecWeight, changes.techRecord_maxTrainGbWeight].some(Boolean);
  }
}
