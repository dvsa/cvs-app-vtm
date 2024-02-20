import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefectGETIVA, RequiredStandard, SectionIVA } from '@dvsa/cvs-type-definitions/types/iva/defects/get';
import { INSPECTION_TYPE } from '@models/test-results/test-result-required-standard.model';
import { Store } from '@ngrx/store';
import { RequiredStandardState } from '@store/required-standards/reducers/required-standards.reducer';
import { getRequiredStandardsState } from '@store/required-standards/selectors/required-standards.selector';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-required-standard-select',
  templateUrl: './required-standard-select.component.html',
  styleUrls: ['./required-standard-select.component.scss'],
})
export class RequiredStandardSelectComponent implements OnInit, OnDestroy {

  requiredStandards?: SectionIVA[];
  normalAndBasic?: boolean;
  isEditing = false;
  selectedInspectionType?: INSPECTION_TYPE;
  selectedSection?: SectionIVA;
  selectedRequiredStandard?: RequiredStandard;
  basicAndNormalRequiredStandards?: DefectGETIVA;

  onDestroy$ = new Subject();

  constructor(
    private requiredStandardsStore: Store<RequiredStandardState>,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.requiredStandardsStore.select(getRequiredStandardsState).subscribe((requiredStandards) => {
      if (requiredStandards.basic.length) {
        this.normalAndBasic = true;
        this.requiredStandards = [];
        this.basicAndNormalRequiredStandards = requiredStandards;
      } else {
        this.requiredStandards = requiredStandards.normal;
        this.selectedInspectionType = INSPECTION_TYPE.NORMAL;
      }
    });

  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  handleSelectBasicOrNormal(inspectionType: INSPECTION_TYPE): void {
    this.requiredStandards = inspectionType === INSPECTION_TYPE.BASIC
      ? this.basicAndNormalRequiredStandards?.basic : this.basicAndNormalRequiredStandards?.normal;
  }

  handleSelect(selected?: INSPECTION_TYPE | SectionIVA | RequiredStandard, type?: Types): void {
    switch (type) {
      case Types.InspectionType:
        this.handleSelectBasicOrNormal(selected as INSPECTION_TYPE);
        this.selectedInspectionType = selected as INSPECTION_TYPE;
        this.selectedSection = undefined;
        this.selectedRequiredStandard = undefined;
        break;
      case Types.Section:
        this.selectedSection = selected as SectionIVA;
        this.selectedRequiredStandard = undefined;
        break;
      case Types.RequiredStandard:
        this.selectedRequiredStandard = selected as RequiredStandard;
        if (this.selectedRequiredStandard) {
          void this.router.navigate([this.selectedRequiredStandard.refCalculation], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
          });
        }
        break;
      default:
        console.error('Unsupported:');
        break;
    }
  }

  get types(): typeof Types {
    return Types;
  }

  get inspectionTypes(): INSPECTION_TYPE[] {
    return Object.values(INSPECTION_TYPE) as INSPECTION_TYPE[];
  }
}

enum Types {
  InspectionType,
  Section,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  RequiredStandard,
}
