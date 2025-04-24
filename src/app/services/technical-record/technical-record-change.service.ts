import { Injectable, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import { editingTechRecord, techRecord } from '../../store/technical-records';

@Injectable({
	providedIn: 'root',
})
export class TechnicalRecordChangesService {
	store = inject(Store);
	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	private _hasChanged(property: string) {
		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();

		if (!current || !amended) return true;

		const a = current[property as keyof TechRecordType<'put'>];
		const b = amended[property as keyof TechRecordType<'put'>];

		// Do not count the following edge cases as changes

		// null/undefined -> undefined/null
		if (a == null && b == null) return false;

		// null/undefined -> []
		if (a == null && Array.isArray(b) && b.length === 0) return false;

		// [] -> null/undefined
		if (Array.isArray(a) && a.length === 0 && b != null) return false;

		return !isEqual(a, b);
	}

	hasChanged(...properties: string[]) {
		return properties.some((property) => this._hasChanged(property));
	}
}
