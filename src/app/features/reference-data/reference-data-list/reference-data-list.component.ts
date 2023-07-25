import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { selectAllReferenceDataByResourceType, selectRefDataBySearchTerm, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, Subject, catchError, filter, map, of, switchMap, take, takeUntil } from 'rxjs';

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
  currentPage?: number;
  data: Array<ReferenceDataModelBase> | undefined;
  private destroy$ = new Subject<void>();

  public form!: CustomFormGroup;
  public searchReturned: boolean = false;

  public searchTemplate: FormNode = {
    name: 'criteria',
    type: FormNodeTypes.GROUP,
    children: [
      {
        name: 'filter',
        label: 'Search filter',
        value: '',
        type: FormNodeTypes.CONTROL
      },
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
    private globalErrorService: GlobalErrorService,
    public dfs: DynamicFormService
  ) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.searchTemplate) as CustomFormGroup;
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
    console.log(this.currentPage);
  }

  get paginatedItems$(): Observable<any[]> {
    return of(this.data?.slice(this.pageStart, this.pageEnd) ?? []);
  }

  get numberOfRecords$(): Observable<number> {
    return of(this.data?.length ?? 0);
  }

  search(term: string, filter: string) {
    this.globalErrorService.clearErrors();
    const trimmedTerm = term?.trim();
    if (!trimmedTerm || !filter) {
      const error = !trimmedTerm ? 'You must provide a search criteria' : 'You must select a valid search filter';
      this.globalErrorService.addError({ error, anchorLink: 'term' });
      return;
    }

    if (term === '') {
      return;
    }
    this.currentPage = 1;
    this.store.pipe(select(selectRefDataBySearchTerm(trimmedTerm, this.type, filter)), take(1)).subscribe(items => {
      this.searchReturned = true;
      this.data = items;
    });
    this.handlePaginationChange({ start: 0, end: 24 });
    this.currentPage = undefined;
  }

  clear() {
    this.form.reset();
    if (this.searchReturned) {
      this.currentPage = 1;
      this.store.pipe(select(selectAllReferenceDataByResourceType(this.type)), take(1)).subscribe(items => (this.data = items));
      this.handlePaginationChange({ start: 0, end: 24 });
      this.currentPage = undefined;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
