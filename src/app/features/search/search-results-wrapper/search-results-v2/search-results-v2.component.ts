import { PaginationComponent } from '@/src/app/components/pagination/pagination.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { SEARCH_TYPES } from '@/src/app/models/search-types-enum';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReplaySubject, distinctUntilChanged, takeUntil } from 'rxjs';
import { SearchFormComponent } from '../../search-form/search-form.component';
import { SearchResultComponent } from './search-result/search-result.component';

@Component({
	selector: 'app-search-results-v2',
	templateUrl: './search-results-v2.component.html',
	styleUrls: ['./search-results-v2.component.scss'],
	imports: [SearchFormComponent, SearchResultComponent, RoleRequiredDirective, AsyncPipe, PaginationComponent],
})
export class SearchResultsV2Component implements OnInit, OnDestroy {
	store = inject(Store);
	activatedRoute = inject(ActivatedRoute);
	globalErrorService = inject(GlobalErrorService);
	technicalRecordService = inject(TechnicalRecordService);

	roles = Roles;
	destroy = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
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
