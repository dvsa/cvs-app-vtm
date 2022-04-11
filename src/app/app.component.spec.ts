import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MsalModule } from '@azure/msal-angular';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { UserService } from './services/user-service/user-service';

describe('AppComponent', () => {
  const MockUserService = {
    getUserName$: jest.fn().mockReturnValue(new Observable())
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot({}), MsalModule],
      declarations: [AppComponent, HeaderComponent, FooterComponent],
      providers: [{ provide: UserService, useValue: MockUserService }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
