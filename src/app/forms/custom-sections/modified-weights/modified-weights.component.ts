import { Component, Input, OnInit } from '@angular/core';
import { TechRecordGETHGV, TechRecordGETPSV, TechRecordGETTRL } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { FormNode } from '@forms/services/dynamic-form.types';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

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
  hgvGrossAxisChanged = false;
  trlGrossAxisChanged = false;
  hgvTrainAxisChanged = false;
  psvTrainAxisChanged = false;
  maxTrainAxisChanged = false;

  constructor(private readonly technicalRecordService: TechnicalRecordService) {}

  get psvChanges(): Partial<TechRecordGETPSV> | undefined {
    return this.vehicleType === VehicleTypes.PSV ? (this.changes as Partial<TechRecordGETPSV>) : undefined;
  }

  get hgvChanges(): Partial<TechRecordGETHGV> | undefined {
    return this.vehicleType === VehicleTypes.HGV ? (this.changes as Partial<TechRecordGETHGV>) : undefined;
  }

  get trlChanges(): Partial<TechRecordGETTRL> | undefined {
    return this.vehicleType === VehicleTypes.TRL ? (this.changes as Partial<TechRecordGETTRL>) : undefined;
  }

  get hgvAndTrlGrossAxisChanged() {
    return this.hgvGrossAxisChanged || this.trlGrossAxisChanged;
  }

  ngOnInit(): void {
    this.axleTemplate = this.getAxleTemplate();
    this.psvGrossAxisChanged = this.technicalRecordService.hasPsvGrossAxisChanged(this.changes as Partial<TechRecordGETPSV>);
    this.hgvGrossAxisChanged = this.technicalRecordService.hasHgvGrossAxisChanged(this.changes as Partial<TechRecordGETHGV>);
    this.trlGrossAxisChanged = this.technicalRecordService.hasTrlGrossAxisChanged(this.changes as Partial<TechRecordGETTRL>);
    this.hgvTrainAxisChanged = this.technicalRecordService.hasHgvTrainAxisChanged(this.changes as Partial<TechRecordGETHGV>);
    this.psvTrainAxisChanged = this.technicalRecordService.hasPsvTrainAxisChanged(this.changes as Partial<TechRecordGETPSV>);
    this.maxTrainAxisChanged = this.technicalRecordService.hasMaxTrainAxisChanged(this.changes as Partial<TechRecordGETHGV>);
  }

  getAxleTemplate(): FormNode[] | undefined {
    return vehicleTemplateMap
      .get(this.vehicleType)
      ?.find((template) => template.name === 'weightsSection')
      ?.children?.find((child) => child.name === 'techRecord_axles')
      ?.children?.at(0)
      ?.children?.filter((child) => child.name !== 'axleNumber');
  }
}
