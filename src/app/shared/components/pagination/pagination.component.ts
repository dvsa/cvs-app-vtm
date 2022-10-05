import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, ReplaySubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pagination[tableName]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnDestroy {
  @Input() tableName!: string;
  @Input() numberOfItems: number = 0;
  @Output() paginationOptions = new EventEmitter<{ currentPage: number; itemsPerPage: number; start: number; end: number }>();

  currentPage = 1;
  currentPageSubject = new ReplaySubject<number>(this.currentPage);
  itemsPerPage: number = 5; // this can be extended later to be set via a dom control

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        map(params => Number.parseInt(params[`${this.tableName}-page`] ?? '1', 10))
      )
      .subscribe({
        next: page => {
          this.currentPageSubject.next(page);
          this.cdr.markForCheck();
        }
      });

    this.currentPageSubject.pipe(takeUntil(this.destroy$)).subscribe({
      next: page => {
        const [start, end] = [(page - 1) * this.itemsPerPage, page * this.itemsPerPage];

        this.currentPage = page;
        this.paginationOptions.emit({ currentPage: page, itemsPerPage: this.itemsPerPage, start, end });
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  pageQuery(page: number) {
    return { [`${this.tableName}-page`]: page };
  }
  nextPage() {
    return this.pageQuery(this.currentPage + 1);
  }
  prevPage() {
    return this.pageQuery(this.currentPage - 1);
  }

  trackByFn(index: number, page: number) {
    return page || index;
  }

  get pages() {
    return Array(this.numberOfPages)
      .fill('')
      .map((x, i) => i + 1);
  }

  get numberOfPages() {
    return Math.ceil(this.numberOfItems / this.itemsPerPage);
  }

  get visiblePages() {
    const start = this.currentPage - 3 < 1 ? 0 : this.currentPage - 3;
    const end = this.currentPage + 3 > this.pages.length ? this.pages.length : this.currentPage + 2;
    return this.pages.slice(end < this.pages.length ? start : this.pages.length - 5, start ? end : 5);
  }
}
