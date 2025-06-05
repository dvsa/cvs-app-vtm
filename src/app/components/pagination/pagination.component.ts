import { NgClass } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	inject,
	input,
	model,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ReplaySubject, Subject, map, takeUntil } from 'rxjs';

@Component({
	selector: 'app-pagination[tableName]',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, NgClass, RouterLinkActive],
})
export class PaginationComponent implements OnInit, OnDestroy {
	route = inject(ActivatedRoute);
	cdr = inject(ChangeDetectorRef);

	readonly tableName = input.required<string>();
	readonly numberOfItems = input(0);
	readonly itemsPerPage = input(5);

	paginationOptions = model<{
		currentPage: number;
		itemsPerPage: number;
		start: number;
		end: number;
	}>();

	currentPage = 1;
	currentPageSubject = new ReplaySubject<number>(this.currentPage);
	numberOfVisiblePages = 5;
	_pages?: Array<number>;

	private destroy$ = new Subject<void>();

	ngOnInit(): void {
		this.route.queryParams
			.pipe(
				takeUntil(this.destroy$),
				map((params) => Number.parseInt(params[`${this.tableName()}-page`] ?? '1', 10))
			)
			.subscribe({
				next: (page) => {
					this.currentPageSubject.next(page);
					this.cdr.markForCheck();
				},
			});

		this.currentPageSubject.pipe(takeUntil(this.destroy$)).subscribe({
			next: (page) => {
				const [start, end] = [(page - 1) * this.itemsPerPage(), page * this.itemsPerPage()];

				this.currentPage = page;
				this.paginationOptions.set({
					currentPage: page,
					itemsPerPage: this.itemsPerPage(),
					start,
					end,
				});
				this.cdr.markForCheck();
			},
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	pageQuery(page: number) {
		return { [`${this.tableName()}-page`]: page };
	}
	nextPage() {
		return this.pageQuery(this.currentPage + 1);
	}
	prevPage() {
		return this.pageQuery(this.currentPage - 1);
	}

	get pages() {
		return Array(this.numberOfPages)
			.fill('')
			.map((x, i) => i + 1);
	}

	get numberOfPages() {
		return Math.ceil(this.numberOfItems() / this.itemsPerPage());
	}

	/**
	 * Returns array of visible page buttons.
	 * Allways returns an odd number of pages while keeping current page in the middle.
	 */
	get visiblePages() {
		const range = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
		const middle = Math.ceil(this.numberOfVisiblePages / 2);
		const clampedPage = range(this.currentPage, middle, this.pages.length - (middle - 1));

		return this.pages.slice(Math.max(clampedPage - middle, 0), clampedPage + middle - 1);
	}
}
