import {TestBed, inject} from '@angular/core/testing';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';
import {TechnicalRecordService} from './technical-record.service';
import {MsAdalAngular6Module, MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {catchError, tap} from "rxjs/operators";
import {environment} from "@environment/environment";

export const adalConfig = {
  cacheLocation: 'localStorage',
  clientId: 'appId',
  endpoints: {
    api: 'endpoint'
  },
  postLogoutRedirectUri: window.location.origin,
  tenant: '<tenant name>.onmicrosoft.com'
};

describe('TechnicalRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MsAdalAngular6Module.forRoot({
          tenant: '1x111x11-1xx1-1xxx-xx11-1x1xx11x1111',
          clientId: '11x111x1-1xx1-1111-1x11-x1xx111x11x1',
          redirectUri: window.location.origin,
          endpoints: {
            "https://localhost/Api/": "xxx-xxx1-1111-x111-xxx"
          },
          navigateToLoginRequestUrl: true,
          cacheLocation: 'localStorage',
        })
      ],
      providers: [TechnicalRecordService]
    });

  });

  it('should be created', inject([HttpClient, MsAdalAngular6Service], (service: TechnicalRecordService) => {
    expect(service).toBeTruthy();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
