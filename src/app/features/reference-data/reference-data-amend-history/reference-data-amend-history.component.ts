import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ReferenceDataResourceType, ReferenceDataResourceTypeAudit } from '@models/reference-data.model';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { ReferenceDataState, selectSearchReturn } from '@store/reference-data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reference-data-amend-history',
  templateUrl: './reference-data-amend-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferenceDataAmendHistoryComponent implements OnInit {
  @Input() type!: ReferenceDataResourceType;
  @Input() key!: string;
  @Input() refDataAdminType: any | undefined;
  @Input() titleCaseHeading: any;
  @Input() titleCaseColumn: any;

  pageStart?: number;
  pageEnd?: number;
  auditResults: any[] = [];
  result: any[] = [];
  history: any;

  constructor(private store: Store<ReferenceDataState>, private cdr: ChangeDetectorRef, private referenceDataService: ReferenceDataService) {}

  ngOnInit(): void {
    this.history = this.refDataAdminType.columns.filter((items: any) => items.name != 'resourceKey');
  }

  get dataAudit$(): Observable<any[] | null> {
    return this.store.pipe(select(selectSearchReturn((this.type + '#AUDIT') as ReferenceDataResourceTypeAudit)));
  }

  get numberOfRecords() {
    this.dataAudit$.subscribe(item => this.auditResults.push(item));
    this.result = this.auditResults[0];
    return this.result.length || 0;
  }

  get paginatedFields(): any {
    return this.result.slice(this.pageStart, this.pageEnd);
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }
}
