import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import configJsonDeploy from './../assets/config/config.deploy.json';
import configJsonDev from './../assets/config/config.dev.json';
import { IAppConfig } from './models/app-config.model';
import { createConfig } from '../assets/config';


@Injectable()
export class AppConfig {
  private _settings: IAppConfig;
  constructor(private http: HttpClient) { }
  load(): Promise<IAppConfig> {
    this._settings = isDevMode() ? createConfig(configJsonDev) :
    createConfig(configJsonDeploy);

    return Promise.resolve(this._settings);
  }

  get settings(): IAppConfig {
    return this._settings;
  }
}
