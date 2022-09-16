import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefectsState, filteredDefects } from '@store/defects';
import { selectedTestResultState } from '@store/test-records';
import { TestResultsState } from '@store/test-records/reducers/test-records.reducer';
import { takeUntil, filter, Subject } from 'rxjs';

@Component({
  selector: 'app-defect-select',
  templateUrl: './defect-select.component.html',
  styleUrls: ['./defect-select.component.scss']
})
export class DefectSelectComponent implements OnInit, OnDestroy {
  defects: Defect[] = [];
  isEditing = false;
  selectedDefect?: Defect;
  selectedItem?: Item;
  selectedDeficiency?: Deficiency;
  vehicleType!: VehicleTypes;

  onDestroy$ = new Subject();

  constructor(
    private testResultsStore: Store<TestResultsState>,
    private defectsStore: Store<DefectsState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.testResultsStore
      .select(selectedTestResultState)
      .pipe(
        takeUntil(this.onDestroy$),
        filter(testResult => !!testResult)
      )
      .subscribe(testResult => {
        this.vehicleType = testResult!.vehicleType;
      });

    this.defectsStore.select(filteredDefects(this.vehicleType)).subscribe(defectsTaxonomy => {
      this.defects = defectsTaxonomy;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  get types(): typeof Types {
    return Types;
  }

  hasItems(defect: Defect): boolean {
    return defect.items && defect.items.length > 0;
  }

  hasDeficiencies(item: Item): boolean {
    return item.deficiencies && item.deficiencies.length > 0;
  }

  handleSelect(selected?: Defect | Item | Deficiency, type?: Types): void {
    switch (type) {
      case Types.Defect:
        this.selectedDefect = selected as Defect;
        this.selectedItem = undefined;
        this.selectedDeficiency = undefined;
        break;
      case Types.Item:
        this.selectedItem = selected as Item;
        this.selectedDeficiency = undefined;
        break;
      case Types.Deficiency:
        this.selectedDeficiency = selected as Deficiency;
        this.router.navigate([this.selectedDeficiency!.ref], { relativeTo: this.route });
        break;
      default:
        this.router.navigate([`${this.selectedDefect?.imNumber}.${this.selectedItem?.itemNumber}`], { relativeTo: this.route });
        break;
    }
  }
}

enum Types {
  Defect,
  Item,
  Deficiency
}
