import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, UpperCasePipe } from '@angular/common';
import { Component, Signal, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { IconComponent } from '@components/icon/icon.component';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { TagComponent } from '@components/tag/tag.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { StatusCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/lgv/skeleton';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { StatusCodes, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectTechRecord } from '@store/technical-records';

@Component({
	selector: 'app-tech-record-title[vehicle]',
	templateUrl: './tech-record-title.component.html',
	styleUrls: ['./tech-record-title.component.scss'],
	imports: [
		NgIf,
		IconComponent,
		RoleRequiredDirective,
		ButtonComponent,
		NgSwitch,
		NgSwitchCase,
		NgSwitchDefault,
		NumberPlateComponent,
		TagComponent,
		UpperCasePipe,
		DefaultNullOrEmpty,
	],
})
export class TechRecordTitleComponent {
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);

	readonly vehicle = input<any>();
	readonly actions = input<TechRecordActions>(TechRecordActions.NONE);
	readonly hideActions = input(false);
	readonly customTitle = input('');

	readonly currentTechRecord = this.store.selectSignal(selectTechRecord) as Signal<TechRecordType<'get'> | undefined>;

	readonly queryableActions = computed(() => this.actions().split(','));

	readonly vehicleMakeAndModel = computed(() => {
		const techRecord = this.currentTechRecord();
		return techRecord ? this.technicalRecordService.getMakeAndModel(techRecord) : '';
	});

	get currentVrm(): string | undefined {
		const vehicle = this.vehicle();
		return vehicle?.techRecord_vehicleType !== 'trl' ? (vehicle?.primaryVrm ?? '') : undefined;
	}

	get otherVrms(): string[] | undefined {
		const vehicle = this.vehicle();
		return vehicle?.techRecord_vehicleType !== 'trl' ? (vehicle?.secondaryVrms ?? []) : undefined;
	}

	get vehicleTypes(): typeof VehicleTypes {
		return VehicleTypes;
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get statuses(): typeof StatusCodes {
		return StatusCodes;
	}

	getVehicleType(techRecord: V3TechRecordModel): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(techRecord);
	}

	getCompletenessColor(completeness?: string): 'green' | 'red' {
		return completeness === 'complete' ? 'green' : 'red';
	}

	isVrmEditable(
		statusCode: StatusCode | undefined,
		currentVehicleType: VehicleType,
		editableVehicleType: VehicleType
	): boolean {
		return !this.hideActions() && statusCode !== StatusCodes.ARCHIVED && currentVehicleType === editableVehicleType;
	}

	navigateTo(path: string, queryParams?: Params): void {
		void this.router.navigate([path], { relativeTo: this.route, queryParams });
	}
}
