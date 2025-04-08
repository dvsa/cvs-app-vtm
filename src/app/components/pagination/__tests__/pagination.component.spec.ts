import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PaginationComponent } from '../pagination.component';

@Component({
	selector: 'app-host',
	template: '<app-pagination [tableName]="tableName" [numberOfItems]="numberOfItems"></app-pagination>',
	imports: [PaginationComponent],
})
class HostComponent {
	tableName = 'test-pagination';
	itemsPerPage = 5;
	numberOfItems = 0;

	pageQuery$: Observable<number>;
	constructor(private route: ActivatedRoute) {
		this.pageQuery$ = route.queryParams.pipe(
			map((params) => Number.parseInt(params[`${this.tableName}-page`] ?? '1', 10))
		);
	}
}

describe('PaginationComponent', () => {
	let component: PaginationComponent;
	let fixture: ComponentFixture<HostComponent>;
	let hostComponent: HostComponent;
	let el: DebugElement;
	let router: Router;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [provideRouter([{ path: '', component: PaginationComponent }])],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HostComponent);
		hostComponent = fixture.componentInstance;
		component = fixture.debugElement.query(By.directive(PaginationComponent)).componentInstance;
		el = fixture.debugElement;

		router = TestBed.inject(Router);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it.each([
		[10, 5],
		[5, 10],
	])('should return an array length of %d when items per page is %d', (arrayLength: number, itemsPerPage: number) => {
		hostComponent.numberOfItems = 50;
		jest.spyOn(component, 'itemsPerPage').mockReturnValue(itemsPerPage);
		fixture.detectChanges();
		expect(component.pages).toHaveLength(arrayLength);
	});

	it.each([
		[[1, 2, 3, 4, 5], 1, 50, 5],
		[[2, 3, 4, 5, 6], 4, 50, 5],
		[[6, 7, 8, 9, 10], 10, 50, 5],
		[[4, 5, 6, 7, 8], 6, 100, 10],
		[[1, 2, 3, 4], 1, 17, 5],
	])(
		'should show pages %s on page %d when number of items is %d and items per page is %d',
		fakeAsync((visiblePages: Array<number>, currentPage: number, numberOfItems: number, itemsPerPage: number) => {
			hostComponent.itemsPerPage = itemsPerPage;
			hostComponent.numberOfItems = numberOfItems;

			fixture.ngZone?.run(() => {
				router.initialNavigation();
				router.navigate([], { queryParams: component.pageQuery(currentPage) }).catch((error) => error);
				tick();
				fixture.detectChanges();
			});

			tick();

			expect(component.visiblePages).toEqual(visiblePages);
		})
	);

	it.each([
		{
			currentPage: 1,
			itemsPerPage: 5,
			start: 0,
			end: 5,
		},
		{
			currentPage: 2,
			itemsPerPage: 5,
			start: 5,
			end: 10,
		},
		{
			currentPage: 3,
			itemsPerPage: 15,
			start: 30,
			end: 45,
		},
	])(
		'should emit %p',
		(
			{
				currentPage,
				itemsPerPage,
				start,
				end,
			}: { currentPage: number; itemsPerPage: number; start: number; end: number },
			done
		) => {
			component.paginationOptions.subscribe((opts) => {
				expect(opts?.currentPage).toBe(currentPage);
				expect(opts?.start).toBe(start);
				expect(opts?.end).toBe(end);
				done();
			});

			jest.spyOn(component, 'itemsPerPage').mockReturnValue(itemsPerPage);
			component.currentPageSubject.next(currentPage);
		}
	);

	describe('nextPage', () => {
		it('should go page 1 to 2', fakeAsync(() => {
			hostComponent.numberOfItems = 50;
			fixture.detectChanges();

			fixture.ngZone?.run(() => {
				router.initialNavigation();
			});

			const next: HTMLLinkElement = el.query(By.css(`#${component.tableName()}-next-page`)).nativeElement;
			next.click();

			tick();
			fixture.detectChanges();

			expect(router.url).toBe(`/?${component.tableName()}-page=2`);
		}));

		it('should not render "next" link when already on last page', fakeAsync(() => {
			hostComponent.numberOfItems = 50;
			fixture.detectChanges();

			fixture.ngZone?.run(() => {
				router.initialNavigation();
				router.navigate([], { queryParams: component.pageQuery(10) }).catch((error) => error);
				tick();
				fixture.detectChanges();
			});

			const next = el.query(By.css(`#${component.tableName()}-next-page`));

			expect(next).toBeNull();
		}));
	});

	describe('prevPage', () => {
		it('should go from page 4 to 3', fakeAsync(() => {
			hostComponent.numberOfItems = 50;
			fixture.detectChanges();

			fixture.ngZone?.run(() => {
				router.initialNavigation();
				router.navigate([], { queryParams: component.pageQuery(4) }).catch((error) => error);
				tick();
				fixture.detectChanges();
			});

			const prev: HTMLLinkElement = el.query(By.css(`#${component.tableName()}-prev-page`)).nativeElement;
			prev.click();

			tick();
			fixture.detectChanges();

			expect(router.url).toBe(`/?${component.tableName()}-page=3`);
		}));

		it('should not render "prev" link when already on first page', fakeAsync(() => {
			hostComponent.numberOfItems = 50;
			fixture.detectChanges();

			fixture.ngZone?.run(() => {
				router.initialNavigation();
			});

			const prev = el.query(By.css(`#${component.tableName()}-prev-page`));

			expect(prev).toBeNull();
		}));
	});
});
