import { KeyValuePipe } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import {
	TechRecordGETHGV,
	TechRecordGETPSV,
	TechRecordGETTRL,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

@Component({
	selector: 'app-modified-weights',
	templateUrl: './modified-weights.component.html',
	styleUrls: ['./modified-weights.component.scss'],
	imports: [KeyValuePipe],
})
export class ModifiedWeightsComponent implements OnInit {
	readonly vehicleType = input.required<VehicleTypes>();
	readonly changes = input.required<Partial<TechRecordGETPSV | TechRecordGETHGV | TechRecordGETTRL>>();

	axleTemplate: FormNode[] | undefined;
	psvGrossAxleChanged = false;
	hgvGrossAxleChanged = false;
	trlGrossAxleChanged = false;
	hgvTrainAxleChanged = false;
	psvTrainAxleChanged = false;
	maxTrainAxleChanged = false;

	constructor(private readonly technicalRecordService: TechnicalRecordService) {}

	get isPSV(): boolean {
		return this.vehicleType() === VehicleTypes.PSV;
	}

	get isHGV(): boolean {
		return this.vehicleType() === VehicleTypes.HGV;
	}

	get isTRL(): boolean {
		return this.vehicleType() === VehicleTypes.TRL;
	}

	get psvChanges(): Partial<TechRecordGETPSV> | undefined {
		return this.isPSV ? (this.changes() as Partial<TechRecordGETPSV>) : undefined;
	}

	get hgvChanges(): Partial<TechRecordGETHGV> | undefined {
		return this.isHGV ? (this.changes() as Partial<TechRecordGETHGV>) : undefined;
	}

	get trlChanges(): Partial<TechRecordGETTRL> | undefined {
		return this.isTRL ? (this.changes() as Partial<TechRecordGETTRL>) : undefined;
	}

	get hgvAndtrlGrossAxleChanged() {
		return this.hgvGrossAxleChanged || this.trlGrossAxleChanged;
	}

	ngOnInit(): void {
		this.axleTemplate = this.getAxleTemplate();
		this.psvGrossAxleChanged =
			this.isPSV && this.technicalRecordService.hasPsvGrossAxleChanged(this.changes() as Partial<TechRecordGETPSV>);
		this.hgvGrossAxleChanged =
			this.isHGV && this.technicalRecordService.hasHgvGrossAxleChanged(this.changes() as Partial<TechRecordGETHGV>);
		this.trlGrossAxleChanged =
			this.isTRL && this.technicalRecordService.hasTrlGrossAxleChanged(this.changes() as Partial<TechRecordGETTRL>);
		this.hgvTrainAxleChanged =
			this.isHGV && this.technicalRecordService.hasHgvTrainAxleChanged(this.changes() as Partial<TechRecordGETHGV>);
		this.psvTrainAxleChanged =
			this.isPSV && this.technicalRecordService.hasPsvTrainAxleChanged(this.changes() as Partial<TechRecordGETPSV>);
		this.maxTrainAxleChanged =
			this.isHGV && this.technicalRecordService.hasMaxTrainAxleChanged(this.changes() as Partial<TechRecordGETHGV>);
	}

	getAxleTemplate(): FormNode[] | undefined {
		return vehicleTemplateMap
			.get(this.vehicleType())
			?.find((template) => template.name === 'weightsSection')
			?.children?.find((child) => child.name === 'techRecord_axles')
			?.children?.at(0)
			?.children?.filter((child) => child.name !== 'axleNumber');
	}
}
