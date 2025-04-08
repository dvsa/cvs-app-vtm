import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, input } from '@angular/core';
import {
	ReferenceDataAdminColumn,
	ReferenceDataModelBase,
	ReferenceDataResourceType,
} from '@models/reference-data.model';
import { Store, select } from '@ngrx/store';
import { ReferenceDataState, fetchReferenceDataByKeySearch, selectSearchReturn } from '@store/reference-data';
import { Observable, map } from 'rxjs';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
	selector: 'app-reference-data-amend-history',
	templateUrl: './reference-data-amend-history.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PaginationComponent, AsyncPipe, DatePipe],
})
export class ReferenceDataAmendHistoryComponent implements OnInit {
	readonly type = input('');
	readonly key = input('');
	readonly title = input('');
	readonly columns = input<ReferenceDataAdminColumn[]>([]);

	pageStart?: number;
	pageEnd?: number;

	constructor(
		private cdr: ChangeDetectorRef,
		private store: Store<ReferenceDataState>
	) {}

	ngOnInit(): void {
		// load the audit history
		this.store.dispatch(
			fetchReferenceDataByKeySearch({
				resourceType: `${this.type()}#AUDIT` as ReferenceDataResourceType,
				resourceKey: `${decodeURIComponent(this.key())}#`,
			})
		);
	}

	get history$(): Observable<ReferenceDataModelBase[] | undefined> {
		return this.store.pipe(select(selectSearchReturn(`${this.type()}#AUDIT` as ReferenceDataResourceType)));
	}

	get numberOfRecords$(): Observable<number> {
		return this.history$.pipe(map((items) => items?.length ?? 0));
	}

	get paginatedItems$() {
		return this.history$.pipe(map((items) => items?.slice(this.pageStart, this.pageEnd) ?? []));
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}
}
