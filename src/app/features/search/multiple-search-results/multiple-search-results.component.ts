import { Location } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { Roles } from '@models/roles.enum';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { Store, select } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectQueryParams } from '@store/router/router.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-multiple-search-results',
	templateUrl: './multiple-search-results.component.html',
	styleUrls: ['multiple-search-results.component.scss'],
})
export class MultipleSearchResultsComponent implements OnDestroy {
	searchResults$: Observable<TechRecordSearchSchema[] | undefined>;
	ngDestroy$ = new Subject();

	public globalErrorService = inject(GlobalErrorService);
	private technicalRecordService = inject(TechnicalRecordService);
	private store = inject(Store);
	private location = inject(Location);

	constructor() {
		this.store.pipe(select(selectQueryParams), takeUntil(this.ngDestroy$)).subscribe((params) => {
			if (Object.keys(params).length === 1) {
				const type = Object.keys(params)[0] as SEARCH_TYPES;
				// eslint-disable-next-line security/detect-object-injection
				const searchTerm = params[type] as string;

				if (searchTerm && Object.values(SEARCH_TYPES).includes(type)) {
					this.globalErrorService.clearErrors();
					this.technicalRecordService.searchBy(type, searchTerm);
				}
			}
		});

		this.searchResults$ = this.technicalRecordService.searchResultsWithUniqueSystemNumbers$;
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		this.location.back();
	}

	ngOnDestroy() {
		this.ngDestroy$.next(true);
		this.ngDestroy$.complete();
	}

	public get Roles() {
		return Roles;
	}
}
