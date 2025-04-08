import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, UpperCasePipe } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StatusCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/lgv/skeleton';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { StatusCodes, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectTechRecord } from '@store/technical-records';
import { Observable, take } from 'rxjs';
import { ButtonComponent } from '../../../../components/button/button.component';
import { IconComponent } from '../../../../components/icon/icon.component';
import { NumberPlateComponent } from '../../../../components/number-plate/number-plate.component';
import { TagComponent } from '../../../../components/tag/tag.component';
import { RoleRequiredDirective } from '../../../../directives/app-role-required/app-role-required.directive';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

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
		AsyncPipe,
		UpperCasePipe,
		DefaultNullOrEmpty,
	],
})
export class TechRecordTitleComponent implements OnInit {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly vehicle = input<any>();
	readonly actions = input<TechRecordActions>(TechRecordActions.NONE);
	readonly hideActions = input(false);
	readonly customTitle = input('');

	currentTechRecord$?: Observable<TechRecordType<'get'> | undefined>;
	queryableActions: string[] = [];
	vehicleMakeAndModel = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private store: Store,
		private technicalRecordService: TechnicalRecordService
	) {}

	ngOnInit(): void {
		this.queryableActions = this.actions().split(',');

		this.currentTechRecord$ = this.store.select(selectTechRecord) as Observable<TechRecordType<'get'> | undefined>;

		this.currentTechRecord$.pipe(take(1)).subscribe((data) => {
			if (data) {
				this.vehicleMakeAndModel = this.technicalRecordService.getMakeAndModel(data);
			}
		});
	}

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
