import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { getBySystemNumber, selectTechRecordHistory } from '@store/technical-records';
import { Observable, map } from 'rxjs';
import { ButtonComponent } from '../../../../components/button/button.component';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';

@Component({
	selector: 'app-tech-record-history',
	templateUrl: './tech-record-history.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./tech-record-history.component.scss'],
	imports: [ButtonComponent, RouterLink, PaginationComponent, AsyncPipe, DatePipe],
})
export class TechRecordHistoryComponent implements OnInit {
	readonly currentTechRecord = input<V3TechRecordModel>();

	pageStart?: number;
	pageEnd?: number;

	constructor(
		private cdr: ChangeDetectorRef,
		private store: Store
	) {}

	ngOnInit(): void {
		const currentTechRecord = this.currentTechRecord();
		if (currentTechRecord) {
			this.store.dispatch(
				getBySystemNumber({ systemNumber: (currentTechRecord as TechRecordType<'get'>)?.systemNumber })
			);
		}
	}

	get techRecordHistory$() {
		return this.store.select(selectTechRecordHistory);
	}

	get techRecordHistoryPage$(): Observable<TechRecordSearchSchema[]> {
		return this.techRecordHistory$?.pipe(map((records) => records?.slice(this.pageStart, this.pageEnd) ?? []));
	}

	get numberOfRecords$(): Observable<number> {
		return this.techRecordHistory$?.pipe(map((records) => records?.length ?? 0));
	}

	convertToUnix(date: Date): number {
		return new Date(date).getTime();
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

	get currentTimeStamp() {
		return (this.currentTechRecord() as TechRecordType<'get'>).createdTimestamp;
	}
}
