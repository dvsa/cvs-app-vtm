import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TechRecordHelpersService {

  constructor() { }

  public isNullOrEmpty(str) {
    return (typeof str === 'string' || str == null) ? !str || !str.trim() : false;
  }

  public isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

}
