import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  public pageView(pageName: string, pageUrl: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>window).dataLayer.push('pageView', { pageName, pageUrl });
  }
}
