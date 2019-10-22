import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TestBed, async} from '@angular/core/testing';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import { Store } from '@ngrx/store';

const createSpyObj = (baseName, methodNames): { [key: string]: any } => {
  let obj: any = {};

  for (let i = 0; i < methodNames.length; i++) {
      obj[methodNames[i]] = jest.fn();
  }

  return obj;
};

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy, storeSpy;

  beforeEach(async(() => {
    statusBarSpy =  createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = createSpyObj('Platform', {ready: platformReadySpy});
    storeSpy = createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: StatusBar, useValue: statusBarSpy},
        {provide: SplashScreen, useValue: splashScreenSpy},
        {provide: Platform, useValue: platformSpy},
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
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
