import { Injectable, inject } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { updateEditingTechRecordCancel } from '@store/technical-records';
import { TechRecordComponent } from 'src/app/features/tech-record/tech-record.component';

@Injectable({
	providedIn: 'root',
})
export class CancelEditTechGuard implements CanDeactivate<TechRecordComponent>, CanActivate {
	store = inject(Store);

	canActivate(): boolean {
		this.store.dispatch(updateEditingTechRecordCancel());
		return true;
	}

	canDeactivate(): boolean {
		this.store.dispatch(updateEditingTechRecordCancel());
		return true;
	}
}
