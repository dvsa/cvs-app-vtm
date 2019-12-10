import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IAppConfig } from './models/app-config.model';
import {Injectable} from '@angular/core';
import * as configJsonDev from './../assets/config/config.dev.json';
import * as configJsonDeploy from './../assets/config/config.deploy.json';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class AppConfig {
  static settings: IAppConfig;
  constructor(private http: HttpClient) {}
  load() {
    const jsonFile = `assets/config/config.${environment.name}.json`;
    return of(configJsonDev) // this could be a http request
      .pipe(
        tap(config => {
          if (!(environment.name === 'deploy')) {
            AppConfig.settings = <IAppConfig>configJsonDev.default;
          } else {
            AppConfig.settings = <IAppConfig>configJsonDeploy.default;
          }
          console.log(`adalConfig => ${JSON.stringify(AppConfig.settings.adalConfig)}`);
        })
      )
      .toPromise();
  }
}
