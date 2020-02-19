import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TechRecordHelpersService {
  constructor() {}

  isNullOrEmpty(str) {
    return typeof str === 'string' || str === null || str === undefined
      ? !str || !str.trim()
      : false;
  }

  isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
  }

  capitalizeWord(word: string) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  }
}
