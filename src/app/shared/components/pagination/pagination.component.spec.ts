import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { map, Observable } from 'rxjs';
import { PaginationComponent } from './pagination.component';

@Component({
  selector: 'app-host',
  template: `<app-pagination
    [tableName]="tableName"
    [numberOfItems]="numberOfItems"
    [currentPage]="pageQuery$ | async"
    [itemsPerPage]="itemsPerPage"
  ></app-pagination>`
})
class HostComponent {
  tableName = 'test-pagination';
  itemsPerPage: number = 5;
  numberOfItems: number = 0;

  pageQuery$: Observable<number>;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.pageQuery$ = route.queryParams.pipe(map(params => Number.parseInt(params[`${this.tableName}-page`] ?? '1', 10)));
  }
}

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<HostComponent>;
  let hostComponent: HostComponent;
  let el: DebugElement;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, PaginationComponent],
      imports: [RouterTestingModule.withRoutes([{ path: '', component: PaginationComponent }])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(PaginationComponent)).componentInstance;
    el = fixture.debugElement;

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([
    [10, 5],
    [5, 10]
  ])('should return an array length of %d when items per page is %d', (arrayLenth: number, itemsPerPage: number) => {
    hostComponent.numberOfItems = 50;
    hostComponent.itemsPerPage = itemsPerPage;
    fixture.detectChanges();
    expect(component.pages.length).toBe(arrayLenth);
  });

  it.each([
    [[1, 2, 3, 4, 5], 1, 50, 5],
    [[2, 3, 4, 5, 6], 4, 50, 5],
    [[6, 7, 8, 9, 10], 10, 50, 5],
    [[4, 5, 6, 7, 8], 6, 100, 10]
  ])(
    'should show pages %s on page %d when number of items is %d and items per page is %d',
    fakeAsync((visiblePages: Array<number>, currentPage: number, numberOfItems: number, itemsPerPage: number) => {
      hostComponent.itemsPerPage = itemsPerPage;
      hostComponent.numberOfItems = numberOfItems;

      fixture.ngZone?.run(() => {
        router.initialNavigation();
        router.navigate([], { queryParams: component.pageQuery(currentPage) });
        tick();
        fixture.detectChanges();
      });

      expect(component.visiblePages).toEqual(visiblePages);
    })
  );

  describe('nextPage', () => {
    it('should go page 1 to 2', fakeAsync(() => {
      hostComponent.numberOfItems = 50;
      fixture.detectChanges();

      fixture.ngZone?.run(() => {
        router.initialNavigation();
      });

      const next: HTMLLinkElement = el.query(By.css(`#${component.tableName}-next-page`)).nativeElement;
      next.click();

      tick();
      fixture.detectChanges();

      expect(router.url).toBe(`/?${component.tableName}-page=2`);
    }));

    it('should stay on the same page when already on last', fakeAsync(() => {
      hostComponent.numberOfItems = 50;
      fixture.detectChanges();

      fixture.ngZone?.run(() => {
        router.initialNavigation();
        router.navigate([], { queryParams: component.pageQuery(10) });
        tick();
        fixture.detectChanges();
      });

      const next: HTMLLinkElement = el.query(By.css(`#${component.tableName}-next-page`)).nativeElement;
      next.click();

      tick();
      fixture.detectChanges();

      expect(router.url).toBe(`/?${component.tableName}-page=10`);
    }));
  });

  describe('prevPage', () => {
    it('should go from page 4 to 3', fakeAsync(() => {
      hostComponent.numberOfItems = 50;
      fixture.detectChanges();

      fixture.ngZone?.run(() => {
        router.initialNavigation();
        router.navigate([], { queryParams: component.pageQuery(4) });
        tick();
        fixture.detectChanges();
      });

      const prev: HTMLLinkElement = el.query(By.css(`#${component.tableName}-prev-page`)).nativeElement;
      prev.click();

      tick();
      fixture.detectChanges();

      expect(router.url).toBe(`/?${component.tableName}-page=3`);
    }));

    it('should stay on the same page when already on first', fakeAsync(() => {
      hostComponent.numberOfItems = 50;
      fixture.detectChanges();

      fixture.ngZone?.run(() => {
        router.initialNavigation();
      });

      const prev: HTMLLinkElement = el.query(By.css(`#${component.tableName}-prev-page`)).nativeElement;
      prev.click();

      tick();
      fixture.detectChanges();

      expect(router.url).toBe(`/?${component.tableName}-page=1`);
    }));
  });
});
