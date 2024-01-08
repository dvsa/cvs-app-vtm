import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MsalModule } from '@azure/msal-angular';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { LoadingService } from '@services/loading/loading.service';
import { Observable, of } from 'rxjs';
import { CoreModule } from '@core/core.module';
import { UserService } from '@services/user-service/user-service';
import { AppComponent } from './app.component';
import { initialAppState, State } from './store';

describe('AppComponent', () => {
  const MockUserService = {
    getUserName$: jest.fn().mockReturnValue(new Observable()),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag = () => {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreModule, MsalModule, RouterTestingModule, StoreModule.forRoot({})],
      declarations: [AppComponent],
      providers: [
        provideMockStore<State>({ initialState: initialAppState }),
        { provide: LoadingService, useValue: { showSpinner$: of(false) } },
        { provide: UserService, useValue: MockUserService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
  });
});
