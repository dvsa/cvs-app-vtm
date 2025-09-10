import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { TagComponent, TagType } from '@components/tag/tag.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { Roles } from '@models/roles.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '@pipes/format-vehicle-type/format-vehicle-type.pipe';

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
