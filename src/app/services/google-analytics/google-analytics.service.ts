import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  public pageView(pageName: string, pageUrl: string) {
    (<any>window).dataLayer.push('pageView', { pageName, pageUrl });
  }
}
