import { PaginationComponent } from '@/src/app/components/pagination/pagination.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { SEARCH_TYPES } from '@/src/app/models/search-types-enum';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectTechRecordSearchView } from '@/src/app/store/tech-record-search/tech-record-search.selector';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReplaySubject, distinctUntilChanged, takeUntil } from 'rxjs';
import { SearchFormComponent } from '../search-form/search-form.component';
import { SearchResultComponent } from './search-result/search-result.component';

@Component({
	selector: 'app-search-results',
	templateUrl: './search-results.component.html',
	styleUrls: ['./search-results.component.scss'],
	imports: [
		SearchFormComponent,
		SearchResultComponent,
		RoleRequiredDirective,
		AsyncPipe,
		PaginationComponent,
		RouterLink,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsComponent implements OnDestroy {
	store = inject(Store);
	activatedRoute = inject(ActivatedRoute);
	globalErrorService = inject(GlobalErrorService);
	technicalRecordService = inject(TechnicalRecordService);

	roles = Roles;
	searchView$ = this.store.select(selectTechRecordSearchView);
	destroy = new ReplaySubject<boolean>(1);

	constructor() {
		// Start loading during route activation, before navigation finishes and the view is checked.
		this.activatedRoute.queryParamMap
			.pipe(
				distinctUntilChanged(
					(a, b) =>
						a.get('searchTerm') === b.get('searchTerm') &&
						a.get('searchCriteria') === b.get('searchCriteria') &&
						a.get('includeArchived') === b.get('includeArchived')
				),
				takeUntil(this.destroy)
			)
			.subscribe((params) => {
				const searchTerm = params.get('searchTerm');
				const searchCriteria = params.get('searchCriteria') as SEARCH_TYPES | null;
				const includeArchived = params.get('includeArchived') === 'true';

				if (searchTerm && searchCriteria && Object.values(SEARCH_TYPES).includes(searchCriteria)) {
					this.globalErrorService.clearErrors();
					this.technicalRecordService.searchBy(searchCriteria, searchTerm, includeArchived);
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}
}
