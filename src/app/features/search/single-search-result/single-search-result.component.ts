import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TagType } from '@components/tag/tag.component';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { Roles } from '@models/roles.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';

@Component({
	selector: 'app-single-search-result[searchResult]',
	templateUrl: './single-search-result.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./single-search-result.component.scss'],
})
export class SingleSearchResultComponent {
	@Input() searchResult!: TechRecordSearchSchema;

	public get roles() {
		return Roles;
	}

	public get tagType() {
		switch (this.searchResult?.techRecord_statusCode) {
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
