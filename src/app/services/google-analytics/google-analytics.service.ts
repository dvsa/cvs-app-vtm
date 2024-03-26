import { Injectable } from '@angular/core';
import Analytics, { AnalyticsInstance } from 'analytics';
import googleTagManager from '@analytics/google-tag-manager';
import { environment } from '../../../environments/environment';
import packageInfo from '../../../../package.json';

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  analyticsInstance: AnalyticsInstance;

  constructor() {
    this.analyticsInstance = Analytics({
      app: packageInfo.name,
      version: packageInfo.version,
      plugins: [
        googleTagManager({
          containerId: environment.VTM_GTM_CONTAINER_ID,
        }),
      ],
    });
  }
  public async pageView(pageName: string, pageUrl: string) {
    await this.analyticsInstance.page({ title: pageName, url: pageUrl });
  }
}
