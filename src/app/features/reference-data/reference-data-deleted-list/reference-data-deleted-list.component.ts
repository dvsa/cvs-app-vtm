import { DatePipe } from '@angular/common';
import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import {
	ReferenceDataAdminType,
	ReferenceDataModelBase,
	ReferenceDataResourceType,
} from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { fetchReferenceDataAudit, selectReferenceDataByResourceKey, selectSearchReturn } from '@store/reference-data';
import { take } from 'rxjs';

@Component({
	selector: 'app-reference-data-deleted-list',
	templateUrl: './reference-data-deleted-list.component.html',
	imports: [RoleRequiredDirective, PaginationComponent, DatePipe],
})
export class ReferenceDataDeletedListComponent implements OnInit {
	referenceDataService = inject(ReferenceDataService);
	route = inject(ActivatedRoute);
	store = inject(Store);

	type!: ReferenceDataResourceType;
	refDataAdminType!: Signal<ReferenceDataAdminType | undefined>;
	readonly pageStart = signal<number | undefined>(undefined);
	readonly pageEnd = signal<number | undefined>(undefined);
	// assigned in ngOnInit once the resource type is known from the route
	data: Signal<ReferenceDataModelBase[] | undefined> = signal(undefined);
	readonly paginatedItems = computed<ReferenceDataModelBase[]>(
		() => this.data()?.slice(this.pageStart(), this.pageEnd()) ?? []
	);
	readonly numberOfRecords = computed(() => this.data()?.length ?? 0);

	ngOnInit(): void {
		this.route.parent?.params.pipe(take(1)).subscribe((params) => {
			this.type = params['type'];
			this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
			this.store.dispatch(fetchReferenceDataAudit({ resourceType: `${this.type}#AUDIT` as ReferenceDataResourceType }));
		});
		this.refDataAdminType = this.store.selectSignal(
			selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)
		) as Signal<ReferenceDataAdminType | undefined>;
		this.data = this.store.selectSignal(selectSearchReturn(`${this.type}#AUDIT` as ReferenceDataResourceType));
	}

	get roles(): typeof Roles {
		return Roles;
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart.set(event.start);
		this.pageEnd.set(event.end);
	}
}
