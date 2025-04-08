import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { CollapsibleTextComponent } from '../../../components/collapsible-text/collapsible-text.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { DefaultNullOrEmpty } from '../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-adr-examiner-notes-history-view',
	templateUrl: './adr-examiner-notes-history-view.component.html',
	styleUrls: ['./adr-examiner-notes-history-view.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: AdrExaminerNotesHistoryViewComponent,
			multi: true,
		},
	],
	imports: [CollapsibleTextComponent, PaginationComponent, AsyncPipe, DatePipe, DefaultNullOrEmpty],
})
export class AdrExaminerNotesHistoryViewComponent extends BaseControlComponent implements OnInit, OnDestroy {
	technicalRecordService = inject(TechnicalRecordService);
	routerService = inject(RouterService);
	currentTechRecord?: TechRecordType<'hgv' | 'lgv' | 'trl'> | undefined;
	pageStart?: number;
	pageEnd?: number;
	private destroy$: Subject<void> = new Subject<void>();

	ngOnInit(): void {
		this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((currentTechRecord) => {
			this.currentTechRecord = currentTechRecord as TechRecordType<'hgv' | 'lgv' | 'trl'>;
		});
	}

	get isEditing$(): Observable<boolean> {
		return this.routerService.getRouteDataProperty$('isEditing').pipe(map((isEditing) => !!isEditing));
	}

	handlePaginationChange(event?: { start: number; end: number }): void {
		if (!event) return;
		this.pageStart = event.start;
		this.pageEnd = event.end;
		this.cdr.detectChanges();
	}

	getAdditionalExaminerNotes(): AdditionalExaminerNotes[] {
		return (this.currentTechRecord?.techRecord_adrDetails_additionalExaminerNotes ?? []).sort(
			(a, b) => +new Date(b.createdAtDate ?? '') - +new Date(a.createdAtDate ?? '')
		);
	}

	get currentAdrNotesPage(): AdditionalExaminerNotes[] {
		return (
			this.currentTechRecord?.techRecord_adrDetails_additionalExaminerNotes?.slice(this.pageStart, this.pageEnd) ?? []
		);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
