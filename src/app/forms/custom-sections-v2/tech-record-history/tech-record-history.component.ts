import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { getBySystemNumber, selectTechRecordHistory } from '@store/technical-records';

@Component({
	selector: 'app-technical-record-history',
	templateUrl: './tech-record-history.component.html',
	styleUrls: ['./tech-record-history.component.scss'],
	imports: [ButtonComponent, DatePipe, PaginationComponent, RouterLink, TitleCasePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicalRecordsHistoryComponent extends EditBaseComponent implements OnInit {
	techRecord = input.required<TechRecordType<'get'>>();

	readonly pageStart = signal<number | undefined>(undefined);
	readonly pageEnd = signal<number | undefined>(undefined);
	from = this.store.selectSignal(selectQueryParam('from'));
	readonly techRecordHistory = this.store.selectSignal(selectTechRecordHistory);

	ngOnInit(): void {
		// We prefetch history after amend so the spinner doesn't flicker
		if (this.from() === 'amend') return;

		const techRecord = this.techRecord();
		if (techRecord) {
			this.store.dispatch(getBySystemNumber({ systemNumber: (techRecord as TechRecordType<'get'>)?.systemNumber }));
		}
	}

	readonly techRecordHistoryPage = computed<TechRecordSearchSchema[]>(
		() => this.techRecordHistory()?.slice(this.pageStart(), this.pageEnd()) ?? []
	);

	readonly numberOfRecords = computed(() => this.techRecordHistory()?.length ?? 0);

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart.set(event.start);
		this.pageEnd.set(event.end);
	}

	summaryLinkUrl(searchResult: TechRecordSearchSchema) {
		return `/tech-records/${searchResult.systemNumber}/${searchResult.createdTimestamp}`;
	}
}
