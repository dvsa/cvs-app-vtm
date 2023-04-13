import { Injectable } from '@angular/core';

declare const gtag: Function;

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  public eventEmitter(eventName: string, eventCategory: string, eventAction: string, eventLabel?: string, eventValue?: number) {
    gtag('event', eventName, { eventCategory, eventLabel, eventAction, eventValue });
  }
}
