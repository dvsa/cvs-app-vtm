import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { UserService } from './user-service';
import { UserServiceState } from './user-service.reducer';
import { Store, StoreModule } from '@ngrx/store';
import { MsalModule, MsalService, MsalBroadcastService, } from "@azure/msal-angular";
import { AppModule } from "../app.module";
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";

describe('User-Service', () => {
  let service: UserService;

  let mockStore: Store<{ userservice: UserServiceState }>;
  let mockBroadcast: MsalBroadcastService;
  let mockMsal: MsalService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule
      ],
      providers: [
        provideMockStore({ }),
        MsalService,
        MsalBroadcastService,
      ],
    });

    mockStore = TestBed.inject(MockStore);
    mockBroadcast = TestBed.inject(MsalBroadcastService);
    mockMsal = TestBed.inject(MsalService);

    service = new UserService(mockStore, mockBroadcast, mockMsal);
  });

  it('should create the user service', () => {
    expect(service).toBeTruthy();
  });

});
