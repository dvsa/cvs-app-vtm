import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { getBySystemNumber, selectTechRecordHistory } from '@store/technical-records';
import { Observable, map } from 'rxjs';

@Component({
	selector: 'app-technical-record-history',
	templateUrl: './tech-record-history.component.html',
	styleUrls: ['./tech-record-history.component.scss'],
	imports: [ButtonComponent, DatePipe, PaginationComponent, RouterLink, AsyncPipe, TitleCasePipe],
})
export class TechnicalRecordsHistoryComponent extends EditBaseComponent implements OnInit {
	techRecord = input.required<TechRecordType<'get'>>();

	cdr = inject(ChangeDetectorRef);

	pageStart?: number;
	pageEnd?: number;
	from = this.store.selectSignal(selectQueryParam('from'));
	techRecordHistory$ = this.store.select(selectTechRecordHistory);

	ngOnInit(): void {
		// We prefetch history after amend so the spinner doesn't flicker
		if (this.from() === 'amend') return;

		const techRecord = this.techRecord();
		if (techRecord) {
			this.store.dispatch(getBySystemNumber({ systemNumber: (techRecord as TechRecordType<'get'>)?.systemNumber }));
		}
	}

	get techRecordHistoryPage$(): Observable<TechRecordSearchSchema[]> {
		return this.techRecordHistory$?.pipe(map((records) => records?.slice(this.pageStart, this.pageEnd) ?? []));
	}

	get numberOfRecords$(): Observable<number> {
		return this.techRecordHistory$?.pipe(map((records) => records?.length ?? 0));
	}

	handlePaginationChange(event?: { start: number; end: number }) {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}

	summaryLinkUrl(searchResult: TechRecordSearchSchema) {
		return `/tech-records/${searchResult.systemNumber}/${searchResult.createdTimestamp}`;
	}
}
