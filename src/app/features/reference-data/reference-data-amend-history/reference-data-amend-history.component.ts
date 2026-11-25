import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { PaginationComponent } from '@components/pagination/pagination.component';
import {
	ReferenceDataAdminColumn,
	ReferenceDataModelBase,
	ReferenceDataResourceType,
} from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { ReferenceDataState, fetchReferenceDataByKeySearch, selectSearchReturn } from '@store/reference-data';

@Component({
	selector: 'app-reference-data-amend-history',
	templateUrl: './reference-data-amend-history.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PaginationComponent, DatePipe],
})
export class ReferenceDataAmendHistoryComponent implements OnInit {
	store = inject<Store<ReferenceDataState>>(Store<ReferenceDataState>);

	readonly type = input('');
	readonly key = input('');
	readonly title = input('');
	readonly columns = input<ReferenceDataAdminColumn[]>([]);

	readonly pageStart = signal<number | undefined>(undefined);
	readonly pageEnd = signal<number | undefined>(undefined);

	private readonly historySelector = computed(() =>
		selectSearchReturn(`${this.type()}#AUDIT` as ReferenceDataResourceType)
	);
	readonly history = this.store.selectSignal<ReferenceDataModelBase[] | undefined>((state) =>
		this.historySelector()(state)
	);
	readonly numberOfRecords = computed(() => this.history()?.length ?? 0);
	readonly paginatedItems = computed(() => this.history()?.slice(this.pageStart(), this.pageEnd()) ?? []);

	ngOnInit(): void {
		// load the audit history
		this.store.dispatch(
			fetchReferenceDataByKeySearch({
				resourceType: `${this.type()}#AUDIT` as ReferenceDataResourceType,
				resourceKey: `${decodeURIComponent(this.key())}#`,
			})
		);
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart.set(event.start);
		this.pageEnd.set(event.end);
	}
}
