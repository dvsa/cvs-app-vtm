import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { getBySystemNumber, selectTechRecordHistory } from '@store/technical-records';

@Component({
	selector: 'app-tech-record-history',
	templateUrl: './tech-record-history.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./tech-record-history.component.scss'],
	imports: [ButtonComponent, RouterLink, PaginationComponent, DatePipe],
})
export class TechRecordHistoryComponent implements OnInit {
	store = inject(Store);

	readonly currentTechRecord = input<V3TechRecordModel>();

	readonly pageStart = signal<number | undefined>(undefined);
	readonly pageEnd = signal<number | undefined>(undefined);

	readonly techRecordHistory = this.store.selectSignal(selectTechRecordHistory);
	readonly techRecordHistoryPage = computed<TechRecordSearchSchema[]>(
		() => this.techRecordHistory()?.slice(this.pageStart(), this.pageEnd()) ?? []
	);
	readonly numberOfRecords = computed(() => this.techRecordHistory()?.length ?? 0);
	readonly currentTimeStamp = computed(
		() => (this.currentTechRecord() as TechRecordType<'get'> | undefined)?.createdTimestamp
	);

	ngOnInit(): void {
		const currentTechRecord = this.currentTechRecord();
		if (currentTechRecord) {
			this.store.dispatch(
				getBySystemNumber({ systemNumber: (currentTechRecord as TechRecordType<'get'>)?.systemNumber })
			);
		}
	}

	convertToUnix(date: Date): number {
		return new Date(date).getTime();
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart.set(event.start);
		this.pageEnd.set(event.end);
	}

	summaryLinkUrl(searchResult: TechRecordSearchSchema) {
		return `/tech-records/${searchResult.systemNumber}/${searchResult.createdTimestamp}`;
	}
}
