import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { TagComponent, TagType } from '@components/tag/tag.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { Roles } from '@models/roles.enum';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '@pipes/format-vehicle-type/format-vehicle-type.pipe';
import { getRecalls } from '@store/test-records';

@Component({
	selector: 'app-single-search-result[searchResult]',
	templateUrl: './single-search-result.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./single-search-result.component.scss'],
	imports: [
		RoleRequiredDirective,
		RouterLink,
		TagComponent,
		NumberPlateComponent,
		UpperCasePipe,
		DefaultNullOrEmpty,
		FormatVehicleTypePipe,
	],
})
export class SingleSearchResultComponent {
	readonly searchResult = input.required<TechRecordSearchSchema>();
	private readonly store = inject(Store);

	prefetchRecalls(): void {
		const result = this.searchResult();
		const vehicleType = result.techRecord_vehicleType;
		if (vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.PSV || vehicleType === VehicleTypes.TRL) {
			this.store.dispatch(getRecalls({ vin: result.vin }));
		}
	}

	public get roles() {
		return Roles;
	}

	public get tagType() {
		switch (this.searchResult()?.techRecord_statusCode) {
			case StatusCodes.CURRENT:
				return ''; // default is dark blue;
			case StatusCodes.ARCHIVED:
				return TagType.GREY;
			case StatusCodes.PROVISIONAL:
				return TagType.ORANGE;
			default:
				return TagType.BLUE;
		}
	}
}
