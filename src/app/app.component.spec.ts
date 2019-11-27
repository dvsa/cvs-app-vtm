import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TestBed, async} from '@angular/core/testing';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {Store} from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';

const createSpyObj = (baseName, methodNames): { [key: string]: any } => {
  const obj: any = {};

  for (let i = 0; i < methodNames.length; i++) {
    obj[methodNames[i]] = jest.fn();
  }

  return obj;
};

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platform, platformSpy, storeSpy;

  beforeEach(async(() => {
    statusBarSpy = createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platform = {ready: () => platformReadySpy};
    platformSpy = jest.spyOn(platform, 'ready');
    storeSpy = createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: StatusBar, useValue: statusBarSpy},
        {provide: SplashScreen, useValue: splashScreenSpy},
        {provide: Platform, useValue: platform},
        {provide: Store, useValue: storeSpy}
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platform.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
