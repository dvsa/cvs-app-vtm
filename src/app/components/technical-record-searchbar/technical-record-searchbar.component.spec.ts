import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TechnicalRecordSearchbarComponent } from './technical-record-searchbar.component';
import {Store} from "@ngrx/store";
import {AuthenticationGuard} from "microsoft-adal-angular6";
import {APP_BASE_HREF} from "@angular/common";
import {AuthenticationGuardMock} from "../../../../test-config/services-mocks/authentication-guard.mock";

describe('TechnicalRecordSearchbarComponent', () => {
  let component: TechnicalRecordSearchbarComponent;
  let fixture: ComponentFixture<TechnicalRecordSearchbarComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalRecordSearchbarComponent ],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(),
            select: jest.fn()
          }
        },
        { provide: AuthenticationGuard, useValue: authenticationGuardMock },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
      imports: [IonicModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalRecordSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
