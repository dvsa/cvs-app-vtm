import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { selectAllReferenceDataByResourceType, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, map, of, take } from 'rxjs';
import { templateList as countryOfRegistrationTemplateList } from '@forms/templates/reference-data/country-of-registration';
import { templateList as tyresTemplateList } from '@forms/templates/reference-data/tyres';
import { templateList as brakesTemplateList } from '@forms/templates/reference-data/brakes';
import { templateList as hgvTemplateList } from '@forms/templates/reference-data/hgv-make';
import { templateList as psvTemplateList } from '@forms/templates/reference-data/psv-make';
import { templateList as reasonsForAbandoningHgvTemplateList } from '@forms/templates/reference-data/reasons-for-abandoning-hgv';
import { templateList as reasonsForAbandoningPsvTemplateList } from '@forms/templates/reference-data/reasons-for-abandoning-psv';
import { templateList as reasonsForAbandoningTirTemplateList } from '@forms/templates/reference-data/reasons-for-abandoning-TIR';
import { templateList as reasonsForAbandoningTrlTemplateList } from '@forms/templates/reference-data/reasons-for-abandoning-TRL';
import { templateList as specialistReasonsForAbandoningTemplateList } from '@forms/templates/reference-data/specialist-reasons-for-abandoning';
import { templateList as trlTemplateList } from '@forms/templates/reference-data/trl-make';

@Component({
  selector: 'app-reference-data-list',
  templateUrl: './reference-data-list.component.html'
})
export class ReferenceDataListComponent implements OnInit {
  type!: ReferenceDataResourceType;

  constructor(private referenceDataService: ReferenceDataService, private route: ActivatedRoute, private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.type = params['type'];

      console.log('This is the type by url params: ', this.type);
      this.referenceDataService.loadReferenceData(this.type);
    });
  }

  get data$(): Observable<any[] | undefined> {
    return this.store.pipe(select(selectAllReferenceDataByResourceType(this.type)));
  }

  get columns$(): Observable<Array<string>> {
    // return this.store.pipe(
    //   select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)),
    //   map(referenceDataTemplate =>
    //     referenceDataTemplate ? Object.keys(referenceDataTemplate).filter(property => property !== 'resourceType' && property !== 'resourceKey') : []
    //   )
    // );
    switch (this.type) {
      case ReferenceDataResourceType.Brakes:
        return of(brakesTemplateList.map(data => data.column));
      case ReferenceDataResourceType.CountryOfRegistration:
        return of(countryOfRegistrationTemplateList.map(data => data.column));
      case ReferenceDataResourceType.HgvMake:
        return of(hgvTemplateList.map(data => data.column));
      case ReferenceDataResourceType.PsvMake:
        return of(psvTemplateList.map(data => data.column));
      case ReferenceDataResourceType.ReasonsForAbandoningHgv:
        return of(reasonsForAbandoningHgvTemplateList.map(data => data.column));
      case ReferenceDataResourceType.ReasonsForAbandoningPsv:
        return of(reasonsForAbandoningPsvTemplateList.map(data => data.column));
      case ReferenceDataResourceType.ReasonsForAbandoningTrl:
        return of(reasonsForAbandoningTrlTemplateList.map(data => data.column));
      case ReferenceDataResourceType.SpecialistReasonsForAbandoning:
        return of(specialistReasonsForAbandoningTemplateList.map(data => data.column));
      case ReferenceDataResourceType.TirReasonsForAbandoning:
        return of(reasonsForAbandoningTirTemplateList.map(data => data.column));
      case ReferenceDataResourceType.TrlMake:
        return of(trlTemplateList.map(data => data.column));
      case ReferenceDataResourceType.Tyres:
        return of(tyresTemplateList.map(data => data.column));
      default:
        return of(['']);
    }
  }

  public get roles(): typeof Roles {
    return Roles;
  }

  titleCaseHeading(input: ReferenceDataResourceType): string {
    return this.referenceDataService.macroCasetoTitleCase(input);
  }

  titleCaseColumn(s: string): string {
    return this.referenceDataService.camelCaseToTitleCase(s);
  }

  addNew(): void {
    this.router.navigate(['add'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }

  back(): void {
    this.router.navigate(['select-type']);
  }

  amend(resourceKey: HTMLElement): void {
    const key: string = resourceKey.innerHTML;
    this.router.navigate(['amend', key], { relativeTo: this.route });
  }
}
