import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-reference-data-amend-history',
  templateUrl: './reference-data-amend-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferenceDataAmendHistoryComponent {
  @Input() type!: ReferenceDataResourceType;
  @Input() key!: string;
  @Input() dataAudit!: Observable<any[] | null>;
  @Input() columns!: Observable<Array<string>>;
  @Input() titleCaseHeading: any;
  @Input() titleCaseColumn: any;

  numberInDataAudit: any = [];
  pageStart?: number;
  pageEnd?: number;

  constructor(public dfs: DynamicFormService, private cdr: ChangeDetectorRef, private referenceDataService: ReferenceDataService) {}

  get paginatedFields() {
    this.dataAudit.pipe(map(item => this.numberInDataAudit.push(item)));
    return this.numberInDataAudit.slice(this.pageStart, this.pageEnd) ?? [];
  }

  get numberOfRecords(): number {
    return this.numberInDataAudit.length || 0;
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }
}
