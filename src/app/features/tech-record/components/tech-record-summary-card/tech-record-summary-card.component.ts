import { NumberPlateComponent } from '@/src/app/components/number-plate/number-plate.component';
import { TagComponent, TagType } from '@/src/app/components/tag/tag.component';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { RootRoutes, TechRecordCreateRoutes } from '@/src/app/models/routes.enum';
import { StatusCodes, V3TechRecordModel, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '@/src/app/pipes/format-vehicle-type/format-vehicle-type.pipe';
import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
	selector: 'app-tech-record-summary-card',
	templateUrl: './tech-record-summary-card.component.html',
	styleUrls: ['./tech-record-summary-card.component.scss'],
	imports: [
		DefaultNullOrEmpty,
		FormatVehicleTypePipe,
		TagComponent,
		NumberPlateComponent,
		RouterLink,
		RoleRequiredDirective,
	],
})
export class TechRecordSummaryCardComponent {
	router = inject(Router);
	route = inject(ActivatedRoute);

	mode = input.required<'view' | 'edit' | 'create'>();
	techRecord = input.required<V3TechRecordModel>();

	readonly Roles = Roles;
	readonly TagType = TagType;
	readonly StatusCodes = StatusCodes;
	readonly VehicleTypes = VehicleTypes;

	onChange(): void {
		this.router.navigate([RootRoutes.CREATE_TECHNICAL_RECORD]);
	}

	onCancel(): void {
		this.router.navigate([TechRecordCreateRoutes.NEW_RECORD_DETAILS_CANCEL], {
			relativeTo: this.route,
		});
	}
}
