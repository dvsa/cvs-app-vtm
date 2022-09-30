import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination[tableName]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() tableName!: string;
  @Input() itemsPerPage: number = 5;
  @Input() numberOfItems: number = 0;
  @Input() currentPage: number = 1;

  constructor() {}

  pageQuery(page: number) {
    return { [`${this.tableName}-page`]: page };
  }
  nextPage() {
    const next = this.currentPage + 1;
    return this.pageQuery(next >= this.pages.length ? this.pages.length : next);
  }
  prevPage() {
    const prev = this.currentPage - 1;
    return this.pageQuery(prev <= 1 ? 1 : prev);
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
    return Math.ceil((this.numberOfItems ?? 0) / this.itemsPerPage);
  }

  get visiblePages() {
    const start = this.currentPage - 2 <= 1 ? 0 : this.currentPage - 3;
    const end = this.currentPage + 2 >= this.pages.length ? this.pages.length : this.currentPage + 2;
    return this.pages.slice(end >= this.pages.length ? this.pages.length - 5 : start, start === 0 ? 5 : end);
  }
}
