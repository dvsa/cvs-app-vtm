import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { selectAllReferenceDataByResourceType, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, of, take } from 'rxjs';
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
      this.referenceDataService.loadReferenceData(this.type);
    });
  }

  get data$(): Observable<any[] | undefined> {
    return this.store.pipe(select(selectAllReferenceDataByResourceType(this.type)));
  }

  get columns$(): Observable<Array<string>> {
    let templateListToReturn: Array<any>;
    switch (this.type) {
      case ReferenceDataResourceType.Brakes:
        templateListToReturn = brakesTemplateList;
        break;
      case ReferenceDataResourceType.CountryOfRegistration:
        templateListToReturn = countryOfRegistrationTemplateList;
        break;
      case ReferenceDataResourceType.HgvMake:
        templateListToReturn = hgvTemplateList;
        break;
      case ReferenceDataResourceType.PsvMake:
        templateListToReturn = psvTemplateList;
        break;
      case ReferenceDataResourceType.ReasonsForAbandoningHgv:
        templateListToReturn = reasonsForAbandoningHgvTemplateList;
        break;
      case ReferenceDataResourceType.ReasonsForAbandoningPsv:
        templateListToReturn = reasonsForAbandoningPsvTemplateList;
        break;
      case ReferenceDataResourceType.ReasonsForAbandoningTrl:
        templateListToReturn = reasonsForAbandoningTrlTemplateList;
        break;
      case ReferenceDataResourceType.SpecialistReasonsForAbandoning:
        templateListToReturn = specialistReasonsForAbandoningTemplateList;
        break;
      case ReferenceDataResourceType.TirReasonsForAbandoning:
        templateListToReturn = reasonsForAbandoningTirTemplateList;
        break;
      case ReferenceDataResourceType.TrlMake:
        templateListToReturn = trlTemplateList;
        break;
      case ReferenceDataResourceType.Tyres:
        templateListToReturn = tyresTemplateList;
        break;
      default:
        templateListToReturn = [''];
        break;
    }
    console.log(
      templateListToReturn.filter(data => {
        if (data.column !== 'resourceKey') data.column;
      })
    );
    return of(templateListToReturn.filter(data => data.column !== 'resourceKey').map(data => data.column));
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
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  back(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  amend(): void {
    console.log('HELP');
    this.router.navigate(['amend'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }
}
