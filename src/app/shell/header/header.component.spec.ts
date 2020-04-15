import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, inject, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MsAdalAngular6Module, MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { of } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { HeaderComponent } from './header.component';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let injector: TestBed;
  let fixture: ComponentFixture<HeaderComponent>;
  let dialog: MatDialog;
  let adal: MsAdalAngular6Service;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MaterialModule,
        BrowserAnimationsModule,
        MsAdalAngular6Module.forRoot({
          tenant: '1x111x11-1xx1-1xxx-xx11-1x1xx11x1111',
          clientId: '11x111x1-1xx1-1111-1x11-x1xx111x11x1',
          redirectUri: window.location.origin,
          endpoints: {
            'https://localhost/Api/': 'xxx-xxx1-1111-x111-xxx'
          },
          navigateToLoginRequestUrl: true,
          cacheLocation: 'localStorage',
        })
      ],
      providers: [
        {
          provide: MsAdalAngular6Service,
          useValue: {
            userInfo: { profile: { name: 'test' } },
            isAuthenticated: true,
            logout: jest.fn(),
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    dialog = injector.get(MatDialog);
    component.menuOpen = false;
    fixture.detectChanges();
  });

  it('should create', inject([HttpTestingController, MsAdalAngular6Service], () => {
    expect(component).toBeTruthy();
  }));

  describe('ngOnInit', () => {
    beforeEach(() => {
      adal = injector.get(MsAdalAngular6Service);
    });
    it('test ngOnInit having adal username not null', () => {
      component.ngOnInit();
      expect(component.userName).toEqual(adal.userInfo.profile.name);
    });
  });

  it('should change value of menuOpen on click event', () => {
    const event = { currentTarget: { checked: false } };
    component.onClick(event);
    expect(component.menuOpen).toBeTruthy();
  });

  describe('logout', () => {
    test('should lougout if user is authenticated', () => {
      adal = injector.get(MsAdalAngular6Service);
      spyOn(adal, 'logout');
      spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(true)});
      component.logOut();
      expect(adal.logout).toHaveBeenCalled();
    });

    test('should not logout if user presses no on modal', () => {
      adal = injector.get(MsAdalAngular6Service);
      spyOn(adal, 'logout');
      spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(false)});
      component.logOut();
      expect(adal.logout).not.toHaveBeenCalled();
    });
  });
});
