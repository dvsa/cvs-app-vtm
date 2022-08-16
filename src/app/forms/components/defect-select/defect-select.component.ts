import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { Store } from '@ngrx/store';
import { defects, DefectsState, fetchDefects } from '@store/defects';
import { Observable, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-defect-select',
  templateUrl: './defect-select.component.html',
  styleUrls: ['./defect-select.component.scss']
})
export class DefectSelectComponent implements OnInit, OnDestroy {
  @Input() isParentEditing = false;
  @Output() formChange = new EventEmitter<{ defect: Defect, item: Item, deficiency: Deficiency }>();

  isEditing = false;
  selectedDefect?: Defect;
  selectedItem?: Item;
  selectedDeficiency?: Deficiency;

  private destroy$ = new Subject<void>();

  get defects$(): Observable<Defect[]> {
    return this.store.select(defects).pipe(tap(defects => {
      console.log(defects)
    }));
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

  constructor(private store: Store<DefectsState>) { }

  ngOnInit(): void {
    this.store.dispatch(fetchDefects());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleNewEdit(): void {
    this.isEditing = !this.isEditing;
  }

  handleSelect(selected: Defect | Item | Deficiency, type: Types): void {
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
        this.formChange.emit({ defect: this.selectedDefect!, item: this.selectedItem!, deficiency: this.selectedDeficiency })
        break;
    }
  }
}

enum Types { Defect, Item, Deficiency }
