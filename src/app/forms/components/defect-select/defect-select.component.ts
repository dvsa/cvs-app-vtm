import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-defect-select[isParentEditing][defects]',
  templateUrl: './defect-select.component.html',
  styleUrls: ['./defect-select.component.scss']
})
export class DefectSelectComponent implements OnDestroy {
  @Input() defects!: Defect[] | null;
  @Input() isParentEditing = false;
  @Output() formChange = new EventEmitter<{ defect: Defect, item: Item, deficiency?: Deficiency }>();

  isEditing = false;
  selectedDefect?: Defect;
  selectedItem?: Item;
  selectedDeficiency?: Deficiency;

  private destroy$ = new Subject<void>();

  constructor() { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    this.selectedDefect = undefined;
    this.selectedItem = undefined;
    this.selectedDeficiency = undefined;
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
        this.formChange.emit({ defect: this.selectedDefect!, item: this.selectedItem!, deficiency: this.selectedDeficiency })
        this.toggleEditMode();
        break;
      default:
        this.formChange.emit({ defect: this.selectedDefect!, item: this.selectedItem! })
        this.toggleEditMode();
        break;
    }
  }
}

enum Types { Defect, Item, Deficiency }
