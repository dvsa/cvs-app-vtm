import { NumberPlateComponent } from '@/src/app/components/number-plate/number-plate.component';
import { TagComponent, TagType } from '@/src/app/components/tag/tag.component';
import { StatusCodes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '@/src/app/pipes/format-vehicle-type/format-vehicle-type.pipe';
import { UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';

@Component({
	selector: 'app-search-result',
	templateUrl: './search-result.component.html',
	styleUrls: ['./search-result.component.scss'],
	imports: [DefaultNullOrEmpty, TagComponent, NumberPlateComponent, FormatVehicleTypePipe, UpperCasePipe, RouterLink],
})
export class SearchResultComponent {
	searchResult = input.required<TechRecordSearchSchema>();

	getTagType(searchResult: TechRecordSearchSchema): string {
		switch (searchResult.techRecord_statusCode) {
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
