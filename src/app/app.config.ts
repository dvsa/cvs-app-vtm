import { Injectable } from '@angular/core';
import { IAppConfig } from './models/app-config.model';
import { environment } from '@environments/environment';

@Injectable()
export class AppConfig {
  private _settings: IAppConfig;

  constructor() {}

  load(): Promise<IAppConfig> {
    // TODO Remove once docker image is created, is used to debug
    // create-docker branch needs to be updated
    console.log('environment Promise');
    console.log(environment);
    this._settings = environment;
    return Promise.resolve(environment);
  }

  get settings(): IAppConfig {
    return this._settings;
  }
}
