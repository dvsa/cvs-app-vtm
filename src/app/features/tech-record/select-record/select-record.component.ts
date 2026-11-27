import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { map } from 'rxjs';
import { SearchResultComponent } from '../../search/search-results/search-result/search-result.component';

@Component({
	selector: 'app-select-record',
	templateUrl: './select-record.component.html',
	imports: [AsyncPipe, SearchResultComponent],
})
export class SelectRecordComponent {
	readonly records$ = inject(ActivatedRoute).data.pipe(map((data): TechRecordSearchSchema[] => data['records']));
}
