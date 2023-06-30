import { style } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { fetchReferenceDataAudit, selectAllReferenceDataByResourceType, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, map, take, filter, switchMap, catchError, of, throwError } from 'rxjs';

@Component({
  selector: 'app-reference-data-list',
  templateUrl: './reference-data-list.component.html',
  styleUrls: ['./reference-data-list.component.scss']
})
export class ReferenceDataListComponent implements OnInit {
  type!: ReferenceDataResourceType;
  disabled!: boolean;
  pageStart?: number;
  pageEnd?: number;

  constructor(
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private globalErrorService: GlobalErrorService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.type = params['type'];
      this.referenceDataService.loadReferenceData(this.type);
      this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
    });

    this.globalErrorService.errors$
      .pipe(
        take(1),
        filter(errors => !errors.length),
        switchMap(() => this.referenceDataService.fetchReferenceData((this.type + '#AUDIT') as ReferenceDataResourceType)),
        take(1),
        catchError(error => {
          if (error.status == 404) {
            this.disabled = true;
            return of(true);
          }
          this.disabled = false;
          return of(false);
        })
      )
      .subscribe({
        next: res => {
          if (res) {
            return of(true);
          }
          return of(false);
        }
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

  addNew(): void {
    this.router.navigate(['create'], { relativeTo: this.route }).then(() => {
      window.location.reload();
    });
  }

  deletedItems(): void {
    this.router.navigate(['deleted-items'], { relativeTo: this.route }).then(() => {
      window.location.reload();
    });
  }

  back(): void {
    this.router.navigate(['reference-data']);
  }

  amend(item: ReferenceDataModelBase): void {
    const key = encodeURIComponent(String(item.resourceKey));
    this.router.navigate([key], { relativeTo: this.route }).then(() => {
      window.location.reload();
    });
  }

  delete(item: ReferenceDataModelBase): void {
    const key = encodeURIComponent(String(item.resourceKey));
    this.router.navigate([`${key}/delete`], { relativeTo: this.route });
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
