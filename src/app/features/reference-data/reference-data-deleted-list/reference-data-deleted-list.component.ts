import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { fetchReferenceDataAudit, selectReferenceDataByResourceKey, selectSearchReturn } from '@store/reference-data';
import { Observable, map, take } from 'rxjs';

@Component({
  selector: 'app-reference-data-deleted-list',
  templateUrl: './reference-data-deleted-list.component.html',
})
export class ReferenceDataDeletedListComponent implements OnInit {
  type!: ReferenceDataResourceType;
  pageStart?: number;
  pageEnd?: number;

  constructor(
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.pipe(take(1)).subscribe((params) => {
      this.type = params['type'];
      this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
      this.store.dispatch(fetchReferenceDataAudit({ resourceType: (`${this.type}#AUDIT`) as ReferenceDataResourceType }));
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get refDataAdminType$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)));
  }

  get data$(): Observable<ReferenceDataModelBase[] | undefined> {
    return this.store.pipe(select(selectSearchReturn((`${this.type}#AUDIT`) as ReferenceDataResourceType)));
  }

  get roles(): typeof Roles {
    return Roles;
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get paginatedItems$(): Observable<any[]> {
    return this.data$.pipe(map((items) => items?.slice(this.pageStart, this.pageEnd) ?? []));
  }

  get numberOfRecords$(): Observable<number> {
    return this.data$.pipe(map((items) => items?.length ?? 0));
  }
}
