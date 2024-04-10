import {
  Component, inject, OnDestroy, OnInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import {
  Subject, takeUntil,
} from 'rxjs';

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

  handlePaginationChange({ start, end }: { start: number; end: number }): void {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }

  get adrNotes(): AdditionalExaminerNotes[] {
    return this.currentTechRecord?.techRecord_adrDetails_additionalExaminerNotes ?? [];
  }

  get currentAdrNotesPage(): AdditionalExaminerNotes[] {
    return this.currentTechRecord?.techRecord_adrDetails_additionalExaminerNotes?.slice(this.pageStart, this.pageEnd) ?? [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
