import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { selectAllReferenceDataByResourceType, selectRefDataBySearchTerm, selectReferenceDataByResourceKey } from '@store/reference-data';
import { catchError, filter, map, Observable, of, Subject, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reference-data-list',
  templateUrl: './reference-data-list.component.html',
  styleUrls: ['./reference-data-list.component.scss']
})
export class ReferenceDataListComponent implements OnInit, OnDestroy {
  type!: ReferenceDataResourceType;
  disabled: boolean = true;
  pageStart?: number;
  pageEnd?: number;
  data: Array<ReferenceDataModelBase> | undefined;
  private destroy$ = new Subject<void>();

  public form!: CustomFormGroup;
  public searchResults: Array<ReferenceDataResourceType> | null = null;

  public searchTemplate: FormNode = {
    name: 'criteria',
    type: FormNodeTypes.GROUP,
    children: [
      {
        name: 'term',
        value: '',
        type: FormNodeTypes.CONTROL
      }
    ]
  };

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
        switchMap(() =>
          this.referenceDataService.fetchReferenceDataAudit((this.type + '#AUDIT') as ReferenceDataResourceType).pipe(
            map(array =>
              array.data.map(item => {
                if (item.reason !== undefined) {
                  this.disabled = false;
                }
              })
            )
          )
        ),
        catchError(error => {
          if (error.status == 404) {
            this.disabled = true;
            return of(true);
          }
          return of(false);
        })
      )
      .subscribe({
        next: res => of(!!res)
      });
    this.store.pipe(select(selectAllReferenceDataByResourceType(this.type)), takeUntil(this.destroy$)).subscribe(items => (this.data = items));
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

  navigateToDeletedItems(): void {
    this.router.navigate(['deleted-items'], { relativeTo: this.route });
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
    return of(this.data?.slice(this.pageStart, this.pageEnd) ?? []);
  }

  get numberOfRecords$(): Observable<number> {
    return of(this.data?.length ?? 0);
  }

  search(term: string) {
    console.log(term.trim());
    let trimmedTerm = term.trim();

    if (term === '') {
      return;
    }

    this.store.pipe(select(selectRefDataBySearchTerm(term, this.type)), take(1)).subscribe(items => {
      this.data = items;
    });
    console.log(this.data);
  }

  clear() {
    this.store.pipe(select(selectAllReferenceDataByResourceType(this.type)), takeUntil(this.destroy$)).subscribe(items => (this.data = items));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
