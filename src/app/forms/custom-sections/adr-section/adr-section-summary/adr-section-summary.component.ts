import { Component, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Store } from '@ngrx/store';
import { AdrService } from '@services/adr/adr.service';
import { editingTechRecord, techRecord } from '@store/technical-records';

@Component({
  selector: 'app-adr-section-summary',
  templateUrl: './adr-section-summary.component.html',
  styleUrls: ['./adr-section-summary.component.scss'],
})
export class AdrSectionSummaryComponent {
  store = inject(Store);
  adrService = inject(AdrService);

  currentTechRecord = this.store.selectSignal(techRecord);
  amendedTechRecord = this.store.selectSignal(editingTechRecord);

  hasChanged(property: keyof TechRecordType<'hgv' | 'trl' | 'lgv'>) {
    const current = this.currentTechRecord() as TechRecordType<'hgv' | 'trl' | 'lgv'>;
    const amended = this.amendedTechRecord() as TechRecordType<'hgv' | 'trl' | 'lgv'>;
    if (!current || !amended) return true;
    return current[property] !== amended[property];
  }
}
