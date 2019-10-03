import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {TechnicalRecordService} from './technical-record.service';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

export const adalConfig = {
  cacheLocation: 'localStorage',
  clientId: 'appId',
  endpoints: {
      api:'endpoint'
  },
  postLogoutRedirectUri: window.location.origin,
  tenant: '<tenant name>.onmicrosoft.com'
};

describe('TechnicslRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MsAdalAngular6Service],
      providers: [TechnicalRecordService]
    });
  });

  it('should be created', inject([HttpClient, MsAdalAngular6Service], (service: TechnicalRecordService) => {
    expect(service).toBeTruthy();
  }));
});
