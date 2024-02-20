import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  requiredStandards?: any;
  normalAndBasic?: boolean;
  isEditing = false;
  selectedInspectionType?: INSPECTION_TYPE;
  selectedSection?: any; // TODO: fix these types
  selectedRequiredStandard?: any;
  payload: any; // TODO: this is bad

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
        this.payload = requiredStandards;
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
      ? this.payload?.basic : this.payload?.normal;
  }

  handleSelect(selected?: any, type?: Types): void {
    switch (type) {
      case Types.InspectionType:
        this.handleSelectBasicOrNormal(selected);
        console.log(this.requiredStandards);
        this.selectedInspectionType = selected as INSPECTION_TYPE;
        this.selectedSection = undefined;
        this.selectedRequiredStandard = undefined;
        break;
      case Types.Section:
        this.selectedSection = selected;
        this.selectedRequiredStandard = undefined;
        break;
      case Types.RequiredStandard:
        this.selectedRequiredStandard = selected;
        // TODO: add navigation to next page
        console.log(this.selectedRequiredStandard);
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
  RequiredStandard,
}
