import { Inject } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { initialAppState } from '@store/.';
import { routerState } from '@store/router/selectors/router.selectors';
import { firstValueFrom } from 'rxjs';

import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      providers: [RouterService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([
    [
      [{ label: 'Path1', path: 'path1' }],
      { state: { root: { firstChild: { data: { title: 'Path1' }, routeConfig: { path: 'path1' }, url: [{ path: 'path1' }] } } } }
    ],
    [
      [
        { label: 'Path1', path: 'path1' },
        { label: 'Path2', path: 'path1/path2' }
      ],
      {
        state: {
          root: {
            firstChild: {
              data: { title: 'Path1' },
              routeConfig: { path: 'path1' },
              url: [{ path: 'path1' }],
              firstChild: { data: { title: 'Path2' }, routeConfig: { path: 'path2' }, url: [{ path: 'path1' }, { path: 'path2' }] }
            }
          }
        }
      }
    ]
  ])('should return %o when router state is %o', async (expected: { label: string; path: string }[], routeState: any) => {
    store.overrideSelector(routerState, routeState);
    expect(await firstValueFrom(component.breadcrumbs$)).toEqual(expected);
  });
});
