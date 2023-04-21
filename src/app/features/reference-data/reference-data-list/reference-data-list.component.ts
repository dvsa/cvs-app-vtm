import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceDataResourceType, ReferenceDataModelBase } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { selectAllReferenceDataByResourceType, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, map, take } from 'rxjs';

@Component({
  selector: 'app-reference-data-list',
  templateUrl: './reference-data-list.component.html'
})
export class ReferenceDataListComponent {
  type: ReferenceDataResourceType = ReferenceDataResourceType.Brakes;

  constructor(private referenceDataService: ReferenceDataService, private route: ActivatedRoute, private router: Router, private store: Store) {
    this.referenceDataService.loadReferenceData(ReferenceDataResourceType.ReferenceDataAdminType);

    this.route.queryParams.pipe(take(1)).subscribe(params => {
      this.type = params['type'];
      this.referenceDataService.loadReferenceData(this.type);
    });
  }

  get data$(): Observable<any[] | undefined> {
    return this.store.pipe(select(selectAllReferenceDataByResourceType(this.type)));
  }

  get columns$(): Observable<Array<string>> {
    return this.store.pipe(
      select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)),
      map(referenceDataTemplate =>
        referenceDataTemplate ? Object.keys(referenceDataTemplate).filter(property => property !== 'resourceType' && property !== 'resourceKey') : []
      )
    );
  }

  public get roles(): typeof Roles {
    return Roles;
  }

  titleCaseHeading(input: ReferenceDataResourceType): string {
    return input
      .toString()
      .split('_')
      .map(s => s.charAt(0) + s.slice(1).toLowerCase())
      .join(' ');
  }

  titleCaseColumn(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');
  }

  addNew(): void {
    this.router.navigate(['add'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }

  back(): void {
    this.router.navigate(['select-type'], { relativeTo: this.route });
  }
}
