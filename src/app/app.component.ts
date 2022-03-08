///<reference path="govuk.d.ts">
import { Component } from '@angular/core';
import { initAll } from 'govuk-frontend/govuk/all';
import { EventMessage, EventType } from '@azure/msal-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


@Injectable({
  providedIn: 'root',
})
export class AppComponent {
  title = 'vtm';

  constructor(private msalBroadcastService: MsalBroadcastService) {
    this.msalBroadcastService = msalBroadcastService;
  }

  ngOnInit() {
    initAll();

    
this.msalBroadcastService.msalSubject$
    .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
    )
    .subscribe((result: any) => {
        console.log(result);
    });
  }
}
