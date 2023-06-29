import { style } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { selectAllReferenceDataByResourceType, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, map, take } from 'rxjs';

@Component({
  selector: 'app-reference-data-deleted-list',
  templateUrl: './reference-data-deleted-list.component.html'
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.type = params['type'];
      this.referenceDataService.loadReferenceData(this.type);
      this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
    });
  }

  get refDataAdminType$(): Observable<any | undefined> {
    return this.store.pipe(select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)));
  }

  get data$(): Observable<any[] | undefined> {
    return this.store.pipe(select(selectAllReferenceDataByResourceType(this.type)));
  }

  public get roles(): typeof Roles {
    return Roles;
  }

  back(): void {
    this.router.navigate(['reference-data']);
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }

  get paginatedItems$(): Observable<any[]> {
    return this.data$.pipe(map(items => items?.slice(this.pageStart, this.pageEnd) ?? []));
  }

  get numberOfRecords$(): Observable<number> {
    return this.data$.pipe(map(items => items?.length ?? 0));
  }
}
