import { Injectable } from '@angular/core';
import Analytics, { AnalyticsInstance } from 'analytics';
import googleTagManager from '@analytics/google-tag-manager';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  analyticsInstance: AnalyticsInstance;

  constructor() {
    this.analyticsInstance = Analytics({
      app: 'cvs-app-vtm',
      version: '0.0.1',
      plugins: [
        googleTagManager({
          containerId: environment.VTM_GTM_CONTAINER_ID,
        }),
      ],
    });
  }
  public async pageView(pageName: string, pageUrl: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.analyticsInstance.page({ title: pageName, url: pageUrl });
    // (<any>window).dataLayer.push('pageView', { pageName, pageUrl });
  }
}
