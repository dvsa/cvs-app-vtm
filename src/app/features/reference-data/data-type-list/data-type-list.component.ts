import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { selectAllReferenceDataByResourceType } from '@store/reference-data';
import { map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-data-type-list',
  templateUrl: './data-type-list.component.html'
})
export class DataTypeListComponent implements OnInit, AfterContentInit {
  // TODO: this will be passed in at some point
  private resourceType: ReferenceDataResourceType = ReferenceDataResourceType.CountryOfRegistration;

  constructor(
    private referenceDataService: ReferenceDataService,
    private store: Store,
    public globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.referenceDataService.loadReferenceData(this.resourceType);
  }

  ngAfterContentInit(): void {}

  get referenceData$(): Observable<ReferenceDataModelBase[] | undefined> {
    return this.store.pipe(select(selectAllReferenceDataByResourceType(this.resourceType)));
  }

  public get roles() {
    return Roles;
  }

  handleSubmit(): void {
    this.router.navigate(['../data-type-list/add-reference-data'], { relativeTo: this.route });
  }

  back() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
