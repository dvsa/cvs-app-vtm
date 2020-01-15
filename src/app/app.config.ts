import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as configJsonDeploy from './../assets/config/config.deploy.json';
import * as configJsonDev from './../assets/config/config.dev.json';
import { IAppConfig } from './models/app-config.model';

@Injectable()
export class AppConfig {
  private _settings: IAppConfig;
  constructor(private http: HttpClient) { }
  load() {
    const jsonFile = `assets/config/config.${environment.name}.json`;
    return of(configJsonDev) // this could be a http request
      .pipe(
        tap(config => {
          if (!(environment.name === 'deploy')) {
            this._settings = <IAppConfig>configJsonDev.default;
          } else {
            this._settings = <IAppConfig>configJsonDeploy.default;
          }
          console.log(`adalConfig => ${JSON.stringify(this._settings.adalConfig)}`);
        })
      )
      .toPromise();
  }

  get settings(): IAppConfig {
    return this._settings;
  }
}
