import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { fetchReferenceDataAudit, selectReferenceDataByResourceKey, selectSearchReturn } from '@store/reference-data';
import { Observable, map, take } from 'rxjs';

@Component({
	selector: 'app-reference-data-deleted-list',
	templateUrl: './reference-data-deleted-list.component.html',
	imports: [RoleRequiredDirective, PaginationComponent, AsyncPipe, DatePipe],
})
export class ReferenceDataDeletedListComponent implements OnInit {
	referenceDataService = inject(ReferenceDataService);
	route = inject(ActivatedRoute);
	store = inject(Store);
	cdr = inject(ChangeDetectorRef);

	type!: ReferenceDataResourceType;
	pageStart?: number;
	pageEnd?: number;

	ngOnInit(): void {
		this.route.parent?.params.pipe(take(1)).subscribe((params) => {
			this.type = params['type'];
			this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
			this.store.dispatch(fetchReferenceDataAudit({ resourceType: `${this.type}#AUDIT` as ReferenceDataResourceType }));
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get refDataAdminType$(): Observable<any> {
		return this.store.pipe(
			select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type))
		);
	}

	get data$(): Observable<ReferenceDataModelBase[] | undefined> {
		return this.store.pipe(select(selectSearchReturn(`${this.type}#AUDIT` as ReferenceDataResourceType)));
	}

	get roles(): typeof Roles {
		return Roles;
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get paginatedItems$(): Observable<any[]> {
		return this.data$.pipe(map((items) => items?.slice(this.pageStart, this.pageEnd) ?? []));
	}

	get numberOfRecords$(): Observable<number> {
		return this.data$.pipe(map((items) => items?.length ?? 0));
	}
}
