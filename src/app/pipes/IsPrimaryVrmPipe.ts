import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'IsPrimaryVrm'})
export class IsPrimaryVrmPipe implements PipeTransform {

  transform(vrmsList: any, isPrimary: boolean): any[] {
    if (vrmsList) {
      return vrmsList.filter((listing: any) => listing.isPrimary === isPrimary);
    }
  }
}
