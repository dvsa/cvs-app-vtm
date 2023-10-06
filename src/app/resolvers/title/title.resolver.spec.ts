import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { TitleResolver } from './title.resolver';

describe('TitleResolver', () => {
  let resolver: TitleResolver;
  let titleService: Title;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [TitleResolver, Title, provideMockStore({ initialState: initialAppState })],
    });

    resolver = TestBed.inject(TitleResolver);
    titleService = TestBed.inject(Title);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should set title using Title service', () => {
    const titleServiceSpy = jest.spyOn(titleService, 'setTitle');
    store.setState({
      ...initialAppState,
      router: {
        state: {
          root: {
            params: {
              systemNumber: 'SYS0001',
            },
            data: {
              title: 'Test Results',
            },
            url: [
              {
                path: 'SYS0001',
                parameters: {},
              },
            ],
            outlet: 'primary',
            routeConfig: {
              path: ':systemNumber',
            },
            queryParams: {},
            fragment: null,
            children: [],
          },
        },
        navigationId: 1,
      },
    });
    const resolved = resolver.resolve();
    expect(resolved).toBeTruthy();
    expect(titleServiceSpy).toHaveBeenCalledWith('Vehicle Testing Management - Test Results');
  });
});
